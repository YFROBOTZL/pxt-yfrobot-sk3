enum motor_dir {
    //% block=FWD
    FWD,
    //% block=REV
    REV
}

enum remote_key {
    //% block=Non
    Non = 0,
    //% block=Up
    Up = 1,
    //% block=Down
    Down = 2,
    //% block=Left
    Left = 3,
    //% block=Right
    Right = 4,
    //% block=Up_B
    Up_B = 5,
    //% block=Down_B
    Down_B = 6,
    //% block=Left_B
    Left_B = 7,
    //% block=Right_B
    Right_B = 8
}

enum exter_ports {
    //% block="AD0"
    J1,
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4,
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum exter_ports1 {
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum motor_ports {
    //% block="IO5/11"
    J7,
    //% block="IO8/12"
    J8
}

enum servo_ports {
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4
}

enum CmpStr_dir {
    //% block="ToBefore"
    ToBefore,
    //% block="ToAfter"
    ToAfter
}

/**
 * Coolguy basic extension
 */
//% weight=100 color=#ffc500 icon="\uf17b"
//% groups=['CmpStr', WalkLine', 'NixieTube', 'IRremote', 'UltrasoundWave', 'Motors', 'RGB', others']
namespace Coolguy_basic {
    //----------------------数码管-----------------------------------
    let Segment_SCL: DigitalPin;
    let Segment_SDA: DigitalPin;

    /**
     * NixieTube init
     */
    //% blockId=Segment_Init
    //% block="Set port at %exterpin|"
    //% group=NixieTube
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function Segment_Init(exterpin: exter_ports1) {
        switch (exterpin) {
            case exter_ports1.J5:
                Segment_SCL = DigitalPin.P14;
                Segment_SDA = DigitalPin.P13;
                break;
            case exter_ports1.J6:
                Segment_SCL = DigitalPin.P16;
                Segment_SDA = DigitalPin.P15;
                break;
            default:
                break;
        }
    }

    function Segment_Start() {
        pins.digitalWritePin(Segment_SDA, 0);    //SDA 输出低电平
        control.waitMicros(100);                 //delay 100us
    }

    function Segment_Send_Byte(dat: number) {
        let i: number, testb: number;

        for (i = 0; i < 8; i++) {
            pins.digitalWritePin(Segment_SCL, 0);    //SCL 拉低 

            if (dat & 0x01)//判断是否发高电平 
            {
                pins.digitalWritePin(Segment_SDA, 1);    //SDA 拉高 
            }
            else {
                pins.digitalWritePin(Segment_SDA, 0);  //SDA 拉低 
            }
            dat = dat >> 1;

            control.waitMicros(100);   //延迟100us 
            pins.digitalWritePin(Segment_SCL, 1);    //SCL 拉高 
            control.waitMicros(100);   //延迟100us
        }
    }

    function Segment_Read_Byte(): number {
        let j: number, dat = 0;

        for (j = 0; j < 8; j++) {
            pins.digitalWritePin(Segment_SCL, 0);     //SCL 下拉
            control.waitMicros(100);  //延时 100us

            pins.digitalWritePin(Segment_SCL, 1);    //SCL 上拉

            dat >>= 1;
            if (pins.digitalReadPin(Segment_SDA))      //如果读入高，则或上高电平，再右移 ；如果为低，则跳过if语句，仍右移 
            {
                dat |= 0x80;
            }
            control.waitMicros(100);
        }

        return dat;
    }

    /**
     * NixieTube display
     */
    //% blockId=coolguy_Set_Segment
    //% block="NixieTube displays number %num|"
    //% group=NixieTube
    export function coolguy_Set_Segment(num: number): void {
        let i: number;
        let num_int: number;
        let num1: number, num2: number, num3: number, num4: number, Digitalflag: number;
        num_int = (num * 10);//change the double-type num to long-int-type num_int
        if (!(num_int % 10))//to judge if the double-type num has zero decimals.
        {
            num_int = num_int / 10;
            Digitalflag = 0x01;//if the double-type num has zero decimals, then Digitalflag is 0x01
        }
        else {
            num_int = num_int % 10000;
            Digitalflag = 0x02;//if the double-type num has non-zero decimals, then Digitalflag is 0x02
        }
        num1 = num_int / 1000;//the first number to show
        num2 = (num_int % 1000) / 100;//the second number to show
        num3 = ((num_int % 1000) % 100) / 10;//the third number to show
        num4 = ((num_int % 1000) % 100) % 10;//the fourth number to show

        Segment_Start();
        Segment_Send_Byte(0x05);//表示前面发送了5个字节 
        Segment_Send_Byte(num1);
        Segment_Send_Byte(num2);
        Segment_Send_Byte(num3);
        Segment_Send_Byte(num4);
        Segment_Send_Byte(Digitalflag);
        i = Segment_Read_Byte();

        basic.pause(1); //加上延时，避免一直发数据 
    }

    /**
     * NixieTube display 
     */
    //% blockId=coolguy_Set_Segment2
    //% block="NixieTube display %num1|:%num2|"
    //% group=NixieTube
    export function coolguy_Set_Segment2(num1: number, num2: number) {
        let i: number;
        Segment_Start();
        Segment_Send_Byte(0x02);//表示前面发送了两个字节 
        Segment_Send_Byte(num1);
        Segment_Send_Byte(num2);
        i = Segment_Read_Byte();

        basic.pause(1); //加上延时，避免一直发数据 
    }
}
