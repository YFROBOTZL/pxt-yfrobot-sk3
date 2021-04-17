{
  // motor test
  Coolguy_basic.exter_motor_drive(motor_ports.J7, 255, motor_dir.FWD)
  Coolguy_basic.exter_motor_drive(motor_ports.J8, 255, motor_dir.FWD)
  basic.pause(1000)
  Coolguy_basic.exter_motor_drive(motor_ports.J7, 127, motor_dir.FWD)
  Coolguy_basic.exter_motor_drive(motor_ports.J8, 127, motor_dir.FWD)
  basic.pause(1000)
  Coolguy_basic.exter_motor_drive(motor_ports.J7, 255, motor_dir.REV)
  Coolguy_basic.exter_motor_drive(motor_ports.J8, 255, motor_dir.REV)
  basic.pause(1000)
  Coolguy_basic.exter_motor_drive(motor_ports.J7, 127, motor_dir.REV)
  Coolguy_basic.exter_motor_drive(motor_ports.J8, 127, motor_dir.REV)
  basic.pause(1000)
  
  // Digital tube test
  Coolguy_basic.Segment_Init(exter_ports1.J5)
  Coolguy_basic.coolguy_Set_Segment2(6, 3)
  basic.pause(1000)
  Coolguy_basic.coolguy_Set_Segment(8)
  basic.pause(1000)
  
  // RGB test
  Coolguy_basic.coolguy_WS2812_Init(servo_ports.J2)
  Coolguy_basic.coolguy_WS2812_SetRGB(255, 0, 0, 255)
  basic.pause(1000)
  Coolguy_basic.coolguy_WS2812_SetRGB(255, 0, 255, 0)
  basic.pause(1000)
  Coolguy_basic.coolguy_WS2812_SetRGB(255, 255, 0, 0)
  basic.pause(1000)
    
  // Infrared remote control test
  Coolguy_basic.coolguy_IR_Init(exter_ports.J2)
  basic.showIcon(IconNames.Heart)
  basic.pause(1000)
  Coolguy_basic.coolguy_IR_check()
  basic.showIcon(IconNames.Yes)
  basic.pause(1000)
   
  // Ultrasonic test
  Coolguy_basic.ultrasonic_Init(exter_ports1.J5)
  basic.showNumber(Coolguy_basic.ultrasonic_get())
  basic.pause(1000)
      
  // AI module test
  Coolguy_advan.SoundSensor_SetPort(exter_ports2.J5)
  Coolguy_advan.SoundSensor_SetWiFi("CoolGuyRobot", "robotrobot")
  Coolguy_advan.SoundSensor_WaitInit()
  Coolguy_advan.SoundSensor_SetMode(SoundSensor_Mode.MODE_DIA)
  Coolguy_advan.SoundSensor_Vocice_conversation("Hello, World!")
      
  // Multi-channel voice test
  Coolguy_advan.wtr050_Init(exter_ports3.J2)
  Coolguy_advan.wtr050_recordstart(1)
  basic.pause(2000)
  Coolguy_advan.wtr050_recordstop()
  basic.showIcon(IconNames.Heart)
  Coolguy_advan.wtr050_playvoice(1)
  basic.pause(2000)
  Coolguy_advan.wtr050_stopvoice()
  basic.pause(1000)
        
  // WIFI module test
  Coolguy_advan.iCloudMemory_Serial_Init(exter_ports2.J5)
  Coolguy_advan.SoundSensor_SetWiFi("CoolGuyRobot", "robotrobot")
  basic.showIcon(IconNames.Heart)
  basic.showString("Hello, World!")
          
  // camera module test
  Coolguy_advan.VisionSensor_Begin(exter_ports2.J5, VisionSensor_Mode.CARD)
  basic.showIcon(IconNames.Heart)
  Coolguy_advan.VisionSensor_Detected1(VisionDetect_Others.FACE)) 
  basic.pause(1000)

