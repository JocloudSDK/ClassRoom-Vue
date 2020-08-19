
const en = {
  login: {
    AppName: 'Education',
    AppNameDes: 'Scenario Solutions',
    TBVersion: 'TB',
    HMRVersion: 'HMR',
    ClassName: 'Class ID',
    ClassNamePlaceholder: '4-8 Digits',
    ClassNameBlankTips: 'Please enter class ID.',
    ClassNameMinTips: 'Class ID cannot be less than 4 digits',
    NickName: 'Nickname',
    NickNamePlaceholder: 'Nickname of Teacher',
    NickNameBlankTips: 'Please enter nickname.',
    ClassType: 'Room Type',
    ClassTypeOptions: {
      // LClass: 'Big Class',
      SClass: 'Small Class',
      OClass: 'Private Class'
    },
    Role: 'Role',
    RoleOptions: {
      Teacher: 'Teacher'
      // Student: 'Student'
    },
    LoginText: 'Enter',
    JoinroomFailed: 'Join room failed',
    AlreadyHasTeacher: 'Room already has teacher',
    ErrorTips: 'Please fill in AppID',
    Tips: 'Tips'
  },
  class: {
    ClassName: 'Class ID',
    StartClass: 'Start',
    ClassTime: 'Class time',
    OverClass: 'Stop',
    Courseware: 'Course',
    Discuss: 'Discuss',
    DiscussTips: 'Notice: ',
    DiscussWelcomTips: 'Welcome to ',
    CoursewareTips: 'No courseware yet',
    SendText: 'Send',
    SendTextPlaceholder: 'Say something',
    ChatDisable: 'Ban from chating',
    ChatEnable: 'Allow chating',
    ChatDisableTips: 'All are banned from chatting',
    ChatEnableTips: 'All are allowed to chat',
    Myself: 'Me',
    TogglePPT: 'Switch to Slideshow',
    ToggleWhiteBoard: 'Switch to WhiteBoard',
    CloseMusicTips: 'Please stop warm-up music first',
    WakeMusic: 'warm-up music',
    WelcomeTips: 'Welcome to Jocloud',
    WelcomePriveTips: 'Welcome to Jocloud private class.',
    Feedback: 'Feedback',
    Setting: 'Setting',
    Logout: 'Logout',
    SystemMessage: '[SysMsg]',
    EnterRoom: 'joined',
    LeaveRoom: 'left',
    JoSmallClass: '[Small Class]',
    JoPrivateClass: '[Private Class]',
    StartClassTips: 'Please start class first.',
    WarmMusicErrorTips: 'No warm-up music when connecting with students',
    ChangeToPPT: 'Switch to slideshow',
    ChangeToWhiteboard: 'Switch to whiteboard',
    SelectorIcon: 'selector',
    PenIcon: 'penceil',
    RectIcon: 'rectangle',
    EllipseIcon: 'ellipse',
    TextIcon: 'text',
    EraserIcon: 'eraser',
    ColorPickerIcon: 'color picker',
    NewPageIcon: 'add new page',
    HandleSelectorIcon: 'hand selector'
  },
  setting: {
    Microphone: 'Microphone',
    Camera: 'Camera',
    Fresh: 'Reload',
    Confirm: 'OK',
    MicOptions: {
      Voice: 'Main sound capture driver',
      Audio: 'Realtek(R) Audio'
    },
    CameraOptions: {
      Inte: 'Integrated Camera'
    }
  },
  feedback: {
    Feedback: 'Feedback',
    CurrentVersion: 'Current Version',
    Email: 'Contact',
    EmailPlaceholder: 'Phone/Email（Optional）',
    Description: 'Description',
    DescriptionPlaceholder: 'Please describe your issue. Don\'t leave it bank',
    DescriptionBlankTips: 'Feedback content cannot be empty',
    Cancel: 'Cancle',
    Confirm: 'Submit',
    FeedbackSuccess: 'Submit Success'
  },
  overclass: {
    AudioAddress: 'Please check the class video via',
    Tips: 'Coming soon',
    Cancel: 'Cancle',
    Copy: 'Copy',
    CopySuccess: 'Success'
  },
  exit: {
    ExitTip: 'Logging Out？',
    ExitText: 'Please end the class before logging out.',
    Confirm: 'OK',
    Cancel: 'Cancel'
  }
}

export default en
