exports.showLearnSelect = async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.redirect('/nouser');

    const userName = req.session.user?.name;

    res.render('learn/learn', { userName });
};