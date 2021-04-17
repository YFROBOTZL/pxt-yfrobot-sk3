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
    //----------------------字符串比较---------------------------------
    let Cmpstring = "";
    
    /**
     * Set the compared string
     * @param str the string as comparsion, eg: hello
     */
    //% blockId=CmpStr_SetString
    //% block="Set the compared string %str|"
    //% group=CmpStr
    export function CmpStr_SetString(str: string) {
        Cmpstring = str;
    }

    /**
     * Get the compared string
     */
    //% blockId=CmpStr_GetString
    //% block="Get the compared string"
    //% group=CmpStr
    export function CmpStr_GetString(): string {
        return Cmpstring;
    }

    /**
     * Is the compared string same as expected? 
     */
    //% blockId=CmpStr_StringEqual
    //% block="Is the compared string same as %str|"
    //% group=CmpStr
    export function CmpStr_StringEqual(str: string): boolean {
        if(str === Cmpstring)
            return true;    
        
        return false;
    }

    /**
     * Is the string included? 
     */
    //% blockId=CmpStr_IncludeString
    //% block="Do the compared string include %str|"
    //% group=CmpStr
    export function CmpStr_IncludeString(str: string): boolean {     
        if(Cmpstring.includes(str))
            return true;
        
        return false;
    }

    /**
     * Get the number from the compared string
     */
    //% blockId=CmpStr_Content_ToInt
    //% block="Get the number %String_part| %position|from the compared string"
    //% group=CmpStr
    export function CmpStr_Content_ToInt(String_part: string, position: CmpStr_dir): number {
        let s_position = Cmpstring.indexOf(String_part);

        if(s_position == -1)
            return -1;
        else 
        {
            let comdata = "";
            let clocktime = 0;
            let times = 1;
            let num = "";

            if(position == CmpStr_dir.ToBefore) {
                comdata = Cmpstring.substr(0, s_position);
                for(let i = s_position - 1; i >= 0; i --) {
                    num = comdata.charAt(i);
                    if( num >= '0' && num <= '9') {
                        clocktime += (num.charCodeAt(0) - '0'.charCodeAt(0)) * times;
                        times *= 10;
                    }
                    else if(i == s_position - 1)
                        return -1;
                    else
                        break;	
                }
                return clocktime;
            }
            else {
                comdata = Cmpstring.substr( s_position + String_part.length, Cmpstring.length );
                for(let i = 0; i < comdata.length; i ++) {
                    num = comdata.charAt(i);
                    if( num >= '0' && num <= '9') {
                        clocktime *= 10;
                        clocktime += (num.charCodeAt(0) - '0'.charCodeAt(0));
                    }
                    else if(i == 0)
                        return -1;
                    else
                        break;	
                }
                return clocktime;
            }
        }
    }

    /**
     * Get the string from the compared
     */
    //% blockId=CmpStr_Content_ToString
    //% block="Get the string %String_part| %position|from the compared string"
    //% group=CmpStr
    export function CmpStr_Content_ToString(String_part: string, position: CmpStr_dir): string {
        let s_position = Cmpstring.indexOf(String_part);
        let comdata = "";

        if(s_position == -1)
            comdata = "NULL";
        else {
            if(position == CmpStr_dir.ToBefore)
                comdata = Cmpstring.substr(0, s_position);
            else
                comdata = Cmpstring.substr( s_position + String_part.length, Cmpstring.length );
        }
        return comdata;
    }
    
    //----------------------循线模块-----------------------------------
    let SensorGray_SCL: DigitalPin;
    let SensorGray_SDA: DigitalPin;
    let DATA_BUF = [0, 0, 0, 0, 0, 0];
    let CmpValue_BUF = [0, 0, 0, 0, 0, 0];

    /**
     * GraySensors init(Except J1)
     */
    //% blockId=SensorGray_Init
    //% block="Set GraySensors at %exterpin|"
    //% group=WalkLine
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function SensorGray_Init(exterpin: exter_ports1) {
        switch (exterpin) {
            case exter_ports1.J5:
                SensorGray_SCL = DigitalPin.P13;
                SensorGray_SDA = DigitalPin.P14;
                break;
            case exter_ports1.J6:
                SensorGray_SCL = DigitalPin.P15;
                SensorGray_SDA = DigitalPin.P16;
                break;
            default:
                break;
        }
        pins.digitalWritePin(SensorGray_SCL, 1);
        pins.digitalReadPin(SensorGray_SDA);

        SensorGray_Read();
    }

    /**
     * Set the value as comparsion for five GraySensors
     * @param CmpNum0 the comparsion fo channel0 GraySensors, eg: 500
     * @param CmpNum1 the comparsion fo channel1 GraySensors, eg: 500
     * @param CmpNum2 the comparsion fo channel2 GraySensors, eg: 500
     * @param CmpNum3 the comparsion fo channel3 GraySensors, eg: 500
     * @param CmpNum4 the comparsion fo channel4 GraySensors, eg: 500
     */
    //% blockId=SetCmpValue
    //% block="set comparsion numbers from left to right as %CmpNum0|%CmpNum1|%CmpNum2|%CmpNum3|%CmpNum4|"
    //% group=WalkLine
    //% inlineInputMode=inline
    export function SetCmpValue(CmpNum0: number, CmpNum1: number, CmpNum2: number, CmpNum3: number, CmpNum4: number) {
        CmpValue_BUF[0] = CmpNum0;
        CmpValue_BUF[1] = CmpNum1;
        CmpValue_BUF[2] = CmpNum2;
        CmpValue_BUF[3] = CmpNum3;
        CmpValue_BUF[4] = CmpNum4;
    }

    /**
     * Search the line in a specific number of intersections
     * @param MaxSpeed the maxinum of speed, eg: 255
     * @param LineNum the number of intersection, eg: 1
     * @param EndTime the time after crossing the intersections, eg: 0.25
     */
    //% blockId=RunWalkLine
    //% block="Max speed%MaxSpeed| Search %LineNum| intersection in %EndTime| seconds"
    //% group=WalkLine
    //% MaxSpeed.min=0 MaxSpeed.max=255
    export function RunWalkLine(MaxSpeed: number, LineNum: number, EndTime: number) {
        let temp: number;

        for (let i = 0; i < LineNum; i++) {
            WalkLineFunction(MaxSpeed);
            basic.pause(2);
        }

        temp = EndTime * 100;
        while (temp--) {
            WalkReadValue();
            WalkLineMotorControl(MaxSpeed);

            //basic.pause(3);
        }

        LeftMotorSpeed(-255);	//反正
        RightMotorSpeed(-255);
        basic.pause(20);
        LeftMotorSpeed(0);	//停止
        RightMotorSpeed(0);
    }

    /**
     * Search line in a specific time
     * @param MaxSpeed the maxinum of speed, eg: 255
     * @param Cnt the time searching, eg: 5
     */
    //% blockId=RunWalkLine_Timer
    //% block="Max speed%MaxSpeed| Search line in %Cnt| seconds"
    //% group=WalkLine
    //% MaxSpeed.min=0 MaxSpeed.max=255
    export function RunWalkLine_Timer(MaxSpeed: number, Cnt: number) {
        let i = Cnt * 56;

        while (i--) {
            WalkReadValue();
            WalkLineMotorControl(MaxSpeed);
            basic.pause(1);
        }

        LeftMotorSpeed(0);	//停止
        RightMotorSpeed(0);
    }

    /**
     * Search line in turn-left mode
     * @param MaxSpeed the maxinum of speed, eg: 255
     * @param LineNum the number of intersection, eg: 1
     */
    //% blockId=RunWalkLine_Turn_Left
    //% block="Max speed %MaxSpeed| Turn left after %LineNum| intersections"
    //% group=WalkLine
    //% MaxSpeed.min=0 MaxSpeed.max=255
    export function RunWalkLine_Turn_Left(MaxSpeed: number, LineNum: number) {
        let i = 0;
        let j = LineNum;

        while (j--) {
            LeftMotorSpeed(MaxSpeed * -1);
            RightMotorSpeed(MaxSpeed);

            i = 0;
            if (WalkReadValue() != 0) {	//判断车在线上														
                while (1) {
                    basic.pause(1);
                    WalkReadValue();
                    if (DATA_BUF[4] < CmpValue_BUF[4]) {
                        if (++i > 4)
                            break;
                    } else
                        i = 0;
                }
            }

            i = 0;
            while (1) {
                basic.pause(1);
                WalkReadValue();
                if (DATA_BUF[2] < CmpValue_BUF[2]) {
                    if (++i > 4)
                        break;
                }
                else
                    i = 0;
            }

            if (j === 0) {
                LeftMotorSpeed(MaxSpeed);  //反转实现急停
                RightMotorSpeed(1 - MaxSpeed);
                basic.pause(20);
            }
        }

        LeftMotorSpeed(0);	//停止
        RightMotorSpeed(0);
    }

    /**
     * Search line in turn-right mode
     * @param MaxSpeed the maxinum of speed, eg: 255
     * @param LineNum the number of intersection, eg: 1
     */
    //% blockId=RunWalkLine_Turn_Right
    //% block="Max speed %MaxSpeed| Turn right after %LineNum| intersections"
    //% group=WalkLine
    //% MaxSpeed.min=0 MaxSpeed.max=255
    export function RunWalkLine_Turn_Right(MaxSpeed: number, LineNum: number) {
        let i = 0;
        let j = LineNum;

        while (j--) {
            LeftMotorSpeed(MaxSpeed);
            RightMotorSpeed(MaxSpeed * -1);

            i = 0;
            if (WalkReadValue() != 0) {	//判断车在线上
                while (1) {
                    basic.pause(1);
                    WalkReadValue();
                    if (DATA_BUF[0] < CmpValue_BUF[0]) {
                        if (++i > 4)
                            break;
                    } else
                        i = 0;
                }
            }
            i = 0;
            while (1) {
                basic.pause(1);
                WalkReadValue();
                if (DATA_BUF[2] < CmpValue_BUF[2]) {
                    if (++i > 4)
                        break;
                }
                else
                    i = 0;
            }
            if (j == 0) {
                LeftMotorSpeed(1 - MaxSpeed);
                RightMotorSpeed(MaxSpeed);
                basic.pause(20);
            }
        }

        LeftMotorSpeed(0);	//停止
        RightMotorSpeed(0);
    }

    function WalkReadValue(): number {
        let Temp = 0;
        SensorGray_Read();

        if (DATA_BUF[0] < CmpValue_BUF[0]) {
            Temp++;
        }
        if (DATA_BUF[1] < CmpValue_BUF[1]) {
            Temp++;
        }
        if (DATA_BUF[2] < CmpValue_BUF[2]) {
            Temp++;
        }
        if (DATA_BUF[3] < CmpValue_BUF[3]) {
            Temp++;
        }
        if (DATA_BUF[4] < CmpValue_BUF[4]) {
            Temp++;
        }

        return Temp;
    }

    function WalkLineMotorControl(MaxSpeed: number) {
        if (DATA_BUF[1] < CmpValue_BUF[1]) {  //左边触发黑线 		
            LeftMotorSpeed(0);
            RightMotorSpeed(MaxSpeed);
        }
        else if (DATA_BUF[3] < CmpValue_BUF[3]) { //右边触发黑线 
            LeftMotorSpeed(MaxSpeed);
            RightMotorSpeed(0);
        }
        /*		else if(DATA_BUF[0] < CmpValue_BUF[0]) {   //最左边触发黑线     			
                    LeftMotorSpeed(MaxSpeed);
                    RightMotorSpeed(MaxSpeed);
                    }
                    else if(DATA_BUF[4] < CmpValue_BUF[4]) {   //最右边触发黑线   		
                        LeftMotorSpeed(MaxSpeed);
                        RightMotorSpeed(MaxSpeed);
                    }*/
        else {
            LeftMotorSpeed(MaxSpeed);
            RightMotorSpeed(MaxSpeed);
        }
    }

    function WalkLineFunction(MaxSpeed: number) {
        let Count = 0;

        while (1) {
            WalkReadValue();

            if (!(DATA_BUF[0] < CmpValue_BUF[0] || DATA_BUF[4] < CmpValue_BUF[4])) //判断不在路口
            {
                if (Count > 4) {//判断是否已经检测到黑线
                    //delay(50);
                    return;
                }
                else
                    Count = 0;
            }
            else	//在黑线上
                Count++;

            WalkLineMotorControl(MaxSpeed);
            basic.pause(1);
        }
    }

    function RightMotorSpeed(s: number) {
        // s ranges from 0 to 255
        if (s >= 0)
            exter_motor_drive(motor_ports.J8, s * 3/4, motor_dir.REV)
        else {
            s = 0 - s;  //转为整数
            exter_motor_drive(motor_ports.J8, s * 3/4, motor_dir.FWD)
        }
    }

    function LeftMotorSpeed(s: number) {
        // s ranges from 0 to 255
        if (s >= 0)
            exter_motor_drive(motor_ports.J7, s * 3/4, motor_dir.FWD)
        else {
            s = 0 - s;  //转为整数
            exter_motor_drive(motor_ports.J7, s * 3/4, motor_dir.REV)
        }
    }

    function SensorGray_Read() {
        let DATA = 0;
        let i = 0, j = 0;

        pins.digitalWritePin(SensorGray_SCL, 0);            //开始接受数据
        control.waitMicros(20);

        for (j = 0; j < 5; j++) {
            DATA = 0;
            for (i = 0; i < 16; i++) {
                pins.digitalWritePin(SensorGray_SCL, 0);    //设置低电平
                control.waitMicros(20);

                DATA <<= 1;
                if (pins.digitalReadPin(SensorGray_SDA))    //判断是否高电平
                {
                    DATA += 1;
                }
                //DATA <<= 1;
                //control.waitMicros(20);

                pins.digitalWritePin(SensorGray_SCL, 1);	//设置高电平
                control.waitMicros(10);
            }
            DATA &= 0x3ff;
            DATA_BUF[j] = DATA;  //数据存入缓存
        }
        basic.pause(1)
    }

    /**
     * GraySensors get
     * @param num select the sensor, eg: 1
     */
    //% blockId=SensorGray_ReadOne
    //% block="get the value from No.%num| Sensor"
    //% num.min=1 num.max=5
    //% group=WalkLine
    export function SensorGray_ReadOne(num: number): number {
        SensorGray_Read();
        return DATA_BUF[num - 1];
    }


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

    //--------------------------IRs---------------------------------------
    let IR_ID = 0;
    let IRData = [0, 0];
    let IRCode = 0;
    let Remote_Type = 0;
    let IR_INpin = DigitalPin.P0;

    function IR_Remote_Task() {
        let N: number = 0;

        while (!pins.digitalReadPin(IR_INpin))            //等IR变为高电平，跳过9ms的前导低电平信号
        {
            //control.waitMicros(10);
            if (++N >= 1000) {
                return;
            }
        }

        if (N > 250 && (Remote_Type == 0 || Remote_Type == 1)) //新的NEC遥控   引导信号N大概375-380
        {
            NECIR_Scan();     //新遥控器
        }
        else if (N > 110 && (Remote_Type == 0 || Remote_Type == 2))  //旧的遥控  引导信号N大概120-125
        {
            IR_Scan();  //旧遥控器
        }

        IRCode = IRData[1];

        basic.pause(100);
        IR_ClearFlay();
    }

    function NECIR_Scan() {
        let j: number, k: number;
        let N = 0;
        let IRCOM = [0, 0, 0, 0];

        N = 0;
        while (pins.digitalReadPin(IR_INpin))           //等待IR 变为低电平，跳过4.5ms的前导高电平信号
        {
            //control.waitMicros(10);
            if (++N >= 500) {
                return;
            }
        }
        if (N < 160)     //判断是不是4.5ms引导码
        {
            return;
        }

        for (j = 0; j < 4; j++) {        //收集四组数据
            for (k = 0; k < 8; k++) {       //每组数据8位
                N = 0;
                while (!pins.digitalReadPin(IR_INpin)) {
                    control.waitMicros(10);
                    if (++N >= 100) {
                        return;
                    }
                }
                N = 0;
                while (pins.digitalReadPin(IR_INpin)) {
                    //control.waitMicros(10);
                    if (++N >= 200) {
                        return;
                    }
                }
                IRCOM[j] = IRCOM[j] >> 1;
                if (N >= 40) {
                    IRCOM[j] = IRCOM[j] | 0x80;  //数据最高位补1
                }
            }//end for k
        }//end for j

        if (IRCOM[2] + IRCOM[3] !== 255)   //判断两个数是不是取反关系
        {
            return;
        }

        if (IRCOM[2] > 1) {
            switch (IRCOM[2]) {
                case 0x40: // '+'按键  代表上键
                    IRData[1] = 1;
                    break;

                case 0x19:  // '-'按键  代表下键
                    IRData[1] = 2;
                    break;

                case 0x07:  //前进按键 代表左键
                    IRData[1] = 3;
                    break;

                case 0x09:  //后退按键 代表右键
                    IRData[1] = 4;
                    break;

                case 0x18:  //2键对应 遥控 B+上键
                    IRData[1] = 5;
                    break;

                case 0x52:  //8键对应B+下键
                    IRData[1] = 6;
                    break;

                case 0x08:  //4键对应B+左键
                    IRData[1] = 7;
                    break;

                case 0x5A:  //6键对应B+右键
                    IRData[1] = 8;
                    break;

                default:
                    IRData[1] = 0;
                    break;
            }
        }
        if (Remote_Type === 0)
            Remote_Type = 1;
    }

    function IR_Scan() {
        let j: number, k: number;
        let N = 0;
        let IRCOM = [0, 0];
        let buf = [0, 0, 0, 0, 0, 0, 0, 0];

        N = 0;
        while (pins.digitalReadPin(IR_INpin)) {
            //control.waitMicros(10);
            if (++N >= 100)
                return;
        }
        for (j = 0; j < 2; j++)         //收集2组数据
        {
            for (k = 0; k < 8; k++)        //每组数据8位
            {
                N = 0;
                while (!pins.digitalReadPin(IR_INpin))          //等待 IR 变为高电电平
                {
                    if (++N >= 100) {
                        return;
                    }
                }
                N = 0;
                while (pins.digitalReadPin(IR_INpin))           //计算IR高电平时间
                {
                    if (++N >= 100)
                        return;              //0.14ms计数过长自动离开
                }
                IRCOM[j] = IRCOM[j] >> 1;
                buf[k] = N;
                if (N >= 16) {
                    IRCOM[j] = IRCOM[j] | 0x80; //数据最高位补1
                }
            }//end for k
        }//end for j
        if (IRCOM[0] + IRCOM[1] !== 255)
            return;

        if ((IRCOM[0] & 0x0f) == 0x0f) {
            if (((IRCOM[0] >> 4) & 0xf) == IR_ID) {
                IRData[0] = 0;
                IRData[1] = 0;
            }
        }
        else {
            if (((IRCOM[0] >> 4) & 0xf) <= 7)
                IRData[0] = IRCOM[0] >> 4;
            if ((IRCOM[0] & 0x0f) <= 8)
                IRData[1] = IRCOM[0] & 0x0f;
        }

        if (Remote_Type == 0) Remote_Type = 2;
    }

    function IR_ClearFlay() {
        if (Remote_Type === 1) {
            IRData[1] = 0;
            IRCode = IRData[1];
        }
    }

    /**
     * IR_Init
     */
    //% blockId=coolguy_IR_Init
    //% block="Set port at %pin|"
    //% group=IRremote
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function coolguy_IR_Init(exterpin: exter_ports) {
        switch (exterpin) {
            case exter_ports.J1:
                IR_INpin = DigitalPin.P0;
                break;
            case exter_ports.J2:
                IR_INpin = DigitalPin.P1;
                break;
            case exter_ports.J3:
                IR_INpin = DigitalPin.P2;
                break;
            case exter_ports.J4:
                IR_INpin = DigitalPin.P16;
                break;
            case exter_ports.J5:
                IR_INpin = DigitalPin.P13;
                break;
            case exter_ports.J6:
                IR_INpin = DigitalPin.P15;
                break;
            default:
                break;
        }

    }

    /**
     * IR_Check
     */
    //% blockId=coolguy_IR_Check
    //% block="IR receive"
    //% group=IRremote
    export function coolguy_IR_check() {
        while (1) {
            if (!pins.digitalReadPin(IR_INpin)) {
                IR_Remote_Task();
            }
        }
    }

    /**
     * IR_Remote
     * @param channel the channel of remote, eg: 1
     */
    //% blockId=coolguy_IR_KeyValueCmp
    //% block="Remote channel at %channel| when %key| is pressed"
    //% channel.min=1   channel.max=8
    //% group=IRremote
    export function coolguy_IR_KeyValueCmp(channel: number, key: remote_key): number {
        IR_ID = channel - 1;  //获取通道

        if (IRData[0] === 0 && IRData[1] === 0)  //是否松开
        {
            if (key === 0) return 1;
        }
        else {
            if (key === IRCode && ((channel - 1) === IRData[0] || Remote_Type === 1)) {
                return 1;
            }
        }
        return 0;
    }
    //---------------------UltrasoundWave读取函数--------------------------------------
    let ultrasonic_tri = DigitalPin.P15;
    let ultrasonic_ech = DigitalPin.P16;

    /**
     * UltrasoundWave init
     */
    //% blockId=ultrasonic_Init
    //% block="Set port at %exterpin|"
    //% group=UltrasoundWave
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function ultrasonic_Init(exterpin: exter_ports1) {
        switch (exterpin) {
            case exter_ports1.J5:
                ultrasonic_tri = DigitalPin.P13;
                ultrasonic_ech = DigitalPin.P14;
                break;
            case exter_ports1.J6:
                ultrasonic_tri = DigitalPin.P15;
                ultrasonic_ech = DigitalPin.P16;
                break;
            default:
                break;
        }
    }

    function ultrasonic_read(): number {
        let t: number;
        pins.digitalWritePin(ultrasonic_tri, 0);
        control.waitMicros(2);
        pins.digitalWritePin(ultrasonic_tri, 1);
        control.waitMicros(20);
        pins.digitalWritePin(ultrasonic_tri, 0);    //triggle

        t = pins.pulseIn(ultrasonic_ech, PulseValue.High);
        return t / 58;   //CM
    }

    /**
     * UltrasoundWave get
     */
    //% blockId=ultrasonic_get
    //% block="Get the value of distance"
    //% group=UltrasoundWave
    export function ultrasonic_get(): number {
        let k = 0;
        let sum = 0;
        while (k < 2) {
            sum = sum + ultrasonic_read();
            k++;
        }
        sum = Math.floor(sum / k * 100) / 100;
        return sum;
    }

    //---------------------PM2.5-------------------------------------------------
    // /**
    //  * PM2.5 Get
    //  */
    // //% blockId=Read_PM2_5
    // //% block="PM2.5 Get"
    // //% group=others
    // export function Read_PM2_5(): number {
    //     let voMeasured: number, calcVoltage: number, dustDensity: number;

    //     voMeasured = pins.analogReadPin(AnalogPin.P0); // read the dust value
    //     calcVoltage = voMeasured * (5.0 / 1024.0);
    //     dustDensity = 0.17 * calcVoltage - 0.1;
    //     if (dustDensity < 0) 
    //         dustDensity = 0.1;

    //     return dustDensity;
    // }

    //----------------------RGB--------------------------------------------------
    let rgb = neopixel.create(DigitalPin.P1, 1, NeoPixelMode.RGB);
    
    /**
     * RGB
     * @param exterpin the ports component connect, eg: servo_ports.J2
     */
    //% blockId=coolguy_WS2812_Init
    //% block="Set RGB port as %exterpin"
    //% group=RGB
    export function coolguy_WS2812_Init(exterpin: servo_ports) {
        switch (exterpin) {
            case servo_ports.J2:
                rgb = neopixel.create(DigitalPin.P1, 1, NeoPixelMode.RGB);
                break;
            case servo_ports.J3:
                rgb = neopixel.create(DigitalPin.P2, 1, NeoPixelMode.RGB);
                break;
            case servo_ports.J4:
                rgb = neopixel.create(DigitalPin.P16, 1, NeoPixelMode.RGB);
                break;
            default:
                break;
        }
    }

    /**
     * RGB
     * @param brightness the brightness when RGB on, eg: 120
     * @param r set red, eg: 0
     * @param g set green, eg: 0
     * @param b set blue, eg: 255
     */
    //% blockId=coolguy_WS2812_SetRGB
    //% block="Brightness %brightness|Red %r|Green %g|Blue%b|"
    //% brightness.min=0 brightness.max=255
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255 
    //% inlineInputMode=inline
    //% group=RGB
    export function coolguy_WS2812_SetRGB(brightness: number, r: number, g: number, b: number) {       
        rgb.setBrightness(brightness);
        //rgb.show();
        rgb.showColor(neopixel.rgb(r, g, b));
    }

    /**
     * Button
     * @param exterpin the ports component connect, eg: exter_ports.J1
     */
    //% blockId=coolguy_exter_button
    //% block="Is button %pin|released?"
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=others
    export function exter_button(exterpin: exter_ports): number {
        let pin: DigitalPin;

        switch (exterpin) {
            case exter_ports.J1:
                pin = DigitalPin.P0;
                break;
            case exter_ports.J2:
                pin = DigitalPin.P1;
                break;
            case exter_ports.J3:
                pin = DigitalPin.P2;
                break;
            case exter_ports.J4:
                pin = DigitalPin.P16;
                break;
            case exter_ports.J5:
                pin = DigitalPin.P13;
                break;
            case exter_ports.J6:
                pin = DigitalPin.P15;
                break;
            default:
                break;
        }

        if (!pins.digitalReadPin(pin)) {
            while (!pins.digitalReadPin(pin));
            return 1;
        }
        else {
            return 0;
        }
    }

    /**
     * Motor
     * @param exterpin the ports component connect, eg: motor_ports.J7
     * @param dir the turn of motor, eg: motor_dir.FWD
     * @param speed the speed of motor and range from 0 to 255, eg: 255
     */
    //% blockId=coolguy_extermotor_drive
    //% block="Set motor %exterpin|speed %speed| as %dir|" 
    //% speed.min=0 speed.max=255
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=Motors
    export function exter_motor_drive(exterpin: motor_ports, speed: number, dir: motor_dir): void {
        let motor_pin1: AnalogPin;
        let motor_pin2: AnalogPin;

        switch (exterpin) {
            case motor_ports.J7:
                uBit.buttonA.disable();
                uBit.buttonB.disable();
                motor_pin1 = AnalogPin.P5;
                motor_pin2 = AnalogPin.P11;
                break;
            case motor_ports.J8:
                motor_pin1 = AnalogPin.P8;
                motor_pin2 = AnalogPin.P12;
                break;
            default:
                break;
        }

        switch (dir) {
            case motor_dir.FWD:
                pins.analogWritePin(motor_pin1, 0);
                pins.analogWritePin(motor_pin2, speed*4);
                pins.analogSetPeriod(motor_pin2, 20000);
                break;
            case motor_dir.REV:
                pins.analogWritePin(motor_pin2, 0);
                pins.analogWritePin(motor_pin1, speed*4);
                pins.analogSetPeriod(motor_pin1, 20000);
                break;
            default: break;
        }
    }

    /**
     * Car go straight
     * @param speed the speed of car, eg: 255
     * left: IO5/11
     * right: IO8/12
     */
    //% blockId=coolguy_extermotor_go
    //% block="let car go straight at %speed|" 
    //% speed.min=0 speed.max=255
    //% group=Motors
    export function exter_motor_go(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.REV)
    }

    /**
     * Car go back
     * @param speed the speed of car, eg: 255
     * left: IO5/11
     * right: IO8/12
     */
    //% blockId=coolguy_extermotor_back
    //% block="let car go back at %speed|" 
    //% speed.min=0 speed.max=255
    //% group=Motors
    export function exter_motor_back(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.REV)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.FWD)
    }

    /**
     * Car stop
     * left: IO5/11
     * right: IO8/12
     */
    //% blockId=coolguy_extermotor_stop
    //% block="let car stop" 
    //% group=Motors
    export function exter_motor_stop(): void {
        exter_motor_drive(motor_ports.J7, 0, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, 0, motor_dir.REV)
    }

    /**
     * Car turn left(wheels reverse)
     * @param speed the speed of wheels, eg: 255
     * left: IO5/11
     * right: IO8/12
     */
    //% blockId=coolguy_extermotor_left
    //% block="let car turn left %speed|" 
    //% speed.min=0 speed.max=255
    //% group=Motors
    export function exter_motor_left(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.REV)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.REV)
    }

    /**
     * Car turn right(wheels reverse)
     * @param speed the speed of wheels, eg: 255
     * left: IO5/11
     * right: IO8/12
     */
    //% blockId=coolguy_extermotor_right
    //% block="let car turn right %speed|" 
    //% speed.min=0 speed.max=255
    //% group=Motors
    export function exter_motor_right(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.FWD)
    }

    /**
     * Servo
     * @param pin the pin selected as output, eg: AnalogPin.P0
     * @param val the expected rotation of servo, eg: 90
     */
    //% blockId=coolguy_servocontrol
    //% block="Servo %pin| turn to %val|"
    //% val.min=0 val.max=180
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=1
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=others
    export function servo_control(exterpin: servo_ports, val: number) {
        let pin = AnalogPin.P1;
        switch (exterpin) {
            case servo_ports.J2:
                pin = AnalogPin.P1;
                break;
            case servo_ports.J3:
                pin = AnalogPin.P2;
                break;
            case servo_ports.J4:
                pin = AnalogPin.P16;
                break;
            default:
                break;
        }
        pins.servoWritePin(pin, val);
    }
}
