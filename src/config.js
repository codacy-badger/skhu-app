export default class BuildConfigs{
    // TODO: local 서버 돌리는 법을 몰라서 일단 이렇게 개발
    static API_SERVER_ADDR = __DEV__ == true? 'https://skhu-test.sleepy-owl.com' : 'https://skhusapp.sleepy-owl.com';
    //static API_SERVER_ADDR = 'https://skhusapp.sleepy-owl.com';
    static OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY; // OpenWeatherMap API KEY
    static SENTRY_DSN = process.env.SENTRY_DSN;
    static primaryColor = '#569f59';
    static OtaDeployedAt = '2019.09.16';
}
