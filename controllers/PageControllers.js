const vistaPrincipal = (req, res) => {
    res.render('index')
}

const vistaTables = (req, res) => {
    res.render('tables')
}

const vistaNotifications = (req, res) => {
    res.render('notifications')
}
const vistaIcons = (req, res) => {
    res.render('icons')
}
const vistaMap = (req, res) => {
    res.render('map')
}
const vistaRtl = (req, res) => {
    res.render('rtl')
}
const vistaTypograhpy = (req, res) => {
    res.render('typography')
}
const vistaUpgrade = (req, res) => {
    res.render('upgrade')
}
const vistaUser = (req, res) => {
    res.render('user')
}
const vistaLogin = (req, res) => {
    res.render('login')
}

module.exports ={
    vistaPrincipal,
    vistaTables,
    vistaNotifications,
    vistaIcons, 
    vistaMap,
    vistaRtl,
    vistaTypograhpy,
    vistaUpgrade,
    vistaUser,
    vistaLogin
}