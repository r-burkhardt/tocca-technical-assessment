// User Profile Routes

module.exports = function (app, db) {
    const userProfilesDB = db.collection('UserProfiles');

    app.get('/user_profile', (req, res) => {
        let firstPage = userProfilesDB.orderBy('lastName').limit(50);

        let page = firstPage.get()
            .then((snapshot) => {
                const userProfiles = [];
                snapshot.forEach((doc) => {
                    const tempObj = {};
                    tempObj.user_id = doc.id;
                    tempObj.user_data = doc.data();

                    userProfiles.push(tempObj);
                });

                let last = snapshot.docs[snapshot.docs.length　- 1];

                let next = userProfilesDB.orderBy('lastName').startAfter(last.data().lastName).limit(50);

                res.send({
                    success: true,
                    count: userProfiles.length,
                    user_profiles: userProfiles
                });
            })
            .catch((err) => {
                res.send({
                    succes: false,
                    msg: 'An error occured, get user profiles unsuccessful',
                    error: err
                });
                console.log(err);
            });
    });

    app.get('/user_profile/:user_id', (req, res) => {
        userProfilesDB.doc(req.params.user_id).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('no such document')
                } else {
                    res.send({
                        success: true,
                        user_id: req.params.user_id,
                        userProfile: doc.data()
                    });
                }
            })
            .catch(err => {
                res.send({
                    succes: false,
                    msg: 'An error occured, get user profile unsuccessful',
                    error: err
                });
                console.log(err);
            });
    });

    app.post('/user_profile', (req, res) => {
        userProfilesDB.add(req.body)
            .then(ref => {
                res.send({
                    succes: true,
                    user_id: ref.id
                });
            })
            .catch(err => {
                res.send({
                    succes: false,
                    msg: 'An error occured, creation unsuccessful',
                    error: err
                });
                console.log(err);
            });
    });

    app.put('/user_profile/:user_id', (req, res) => {
        userProfilesDB.doc(req.params.user_id).update(req.body)
            .then(result => {
                res.send({
                    succes: true,
                    msg: 'Update successful'
                });
            })
            .catch(err => {
                res.send({
                    succes: false,
                    msg: 'An error occured, update unsuccessful',
                    error: err
                });
                console.log(err);
            });
    });

    app.delete('/user_profile/:user_id', (req, res) => {
        userProfilesDB.doc(req.params.user_id).delete()
            .then(result => {
                if (result) {
                    res.send({
                        success: true,
                        msg: 'User deleted.'
                    });
                } else {
                    res.send({
                        success: false,
                        msg: 'User not deleted.'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    });
};