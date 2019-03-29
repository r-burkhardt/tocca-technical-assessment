// User Profile Routes

module.exports = function (app, db) {
    const userProfilesDB = db.collection('UserProfiles');

    app.get('/user_profile', (req, res) => {
        let page = (req.query.page) ? parseInt(req.query.page) : 0;
        let size = (req.query.size) ? parseInt(req.query.size) : 50;
        // let startPoint = (page < 2) ? size : (page -1) * size;

        let totalCount;
        userProfilesDB.get().then(snapshot => {
            totalCount = snapshot.size;
        });

        let firstGroup = userProfilesDB.orderBy('user_id').limit((page <= 2) ? size : (page - 1) * size);

        firstGroup.get().then(snapshot => {
            if (page < 2) {
                let uProfiles = [];
                snapshot.forEach(doc => {
                    tempObj = {};
                    uProfiles.push(doc.data());
                });
                res.type('application/json');
                res.send({
                    succes: true,
                    count: totalCount,
                    page: 1,
                    user_profiles: uProfiles
                });
            } else {
                let last = snapshot.docs[snapshot.docs.length -1];

                let next = userProfilesDB
                    .orderBy('user_id')
                    .startAfter(last.data().user_id)
                    .limit(size);

                next.get().then(snapshot => {
                    let uProfiles = [];
                    snapshot.forEach(doc => {
                        uProfiles.push(doc.data());
                    });
                    res.type('application/json');
                    res.send({
                        succes: true,
                        count: totalCount,
                        page: page,
                        user_profiles: uProfiles
                    });
                });
            }
        }).catch();


        // userProfilesDB.orderBy('lastName').startAt(startPoint).limit(size).get()
        //     .then(snapshot => {
        //         let uProfiles = [];
        //         snapshot.forEach(doc => {
        //             tempObj = {};
        //             tempObj.user_id = doc.id;
        //             tempObj.birthYear = doc.data().birthYear;
        //             tempObj.firstName = doc.data().firstName;
        //             tempObj.lastName = doc.data().lastName;
        //             uProfiles.push(tempObj);
        //         });
        //         res.type('application/json');
        //         res.send({
        //             succes: true,
        //             count: snapshot.size,
        //             page: ++page,
        //             user_profiles: uProfiles
        //         });
        //     })
        //     .catch(err => {
        //         res.type('application/json');
        //         res.send({
        //             succes: false,
        //             msg: 'An error occured, get user profiles unsuccessful',
        //             error: err
        //         });
        //         console.log(err);
        //     });


        // let startingGroup = userProfilesDB.orderBy('lastName').limit(startPoint); //startAt(startPoint);
        //
        // startingGroup.get()
        //     .then(snapshot => {
        //
        //         let last = snapshot.docs[snapshot.docs.length - 1]
        //
        //         let returnDocs = userProfilesDB
        //             .orderBy('lastName')
        //             .startAfter(last.id)
        //             .limit(size);
        //
        //         returnDocs.get()
        //             .then(snapshot => {
        //                 let uProfiles = [];
        //                 snapshot.forEach(doc => {
        //                     tempObj = {};
        //                     tempObj.user_id = doc.id;
        //                     tempObj.birthYear = doc.data().birthYear;
        //                     tempObj.firstName = doc.data().firstName;
        //                     tempObj.lastName = doc.data().lastName;
        //                     uProfiles.push(tempObj);
        //                 });
        //                 res.type('application/json');
        //                 res.send({
        //                     succes: true,
        //                     count: snapshot.size,
        //                     page: ++page,
        //                     user_profiles: uProfiles
        //                 });
        //             })
        //             .catch(err => {
        //                 res.type('application/json');
        //                 res.send({
        //                     succes: false,
        //                     msg: 'An error occured, get user profiles unsuccessful',
        //                     error: err
        //                 });
        //                 console.log(err);
        //             });
        //     })
        //     .catch(err => {
        //         res.type('application/json');
        //         res.send({
        //             succes: false,
        //             msg: 'An error occured, get user profiles unsuccessful',
        //             error: err
        //         });
        //         console.log(err);
        //     });






        // let firstPage = userProfilesDB.orderBy('lastName').limit(50);
        //
        // let page = firstPage.get()
        //     .then((snapshot) => {
        //         const userProfiles = [];
        //         snapshot.forEach((doc) => {
        //             const tempObj = {};
        //             tempObj.user_id = doc.id;
        //             tempObj.user_data = doc.data();
        //
        //             userProfiles.push(tempObj);
        //         });
        //
        //         let last = snapshot.docs[snapshot.docs.length　- 1];
        //
        //         let next = userProfilesDB.orderBy('lastName').startAfter(last.data().lastName).limit(50);
        //
        //         res.send({
        //             success: true,
        //             count: userProfiles.length,
        //             user_profiles: userProfiles
        //         });
        //     })
        //     .catch((err) => {
        //         res.send({
        //             succes: false,
        //             msg: 'An error occured, get user profiles unsuccessful',
        //             error: err
        //         });
        //         console.log(err);
        //     });
    });

    app.get('/user_profile/:user_id', (req, res) => {
        userProfilesDB.doc(req.params.user_id).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('no such document')
                } else {
                    res.type('application/json');
                    res.send({
                        success: true,
                        user_id: req.params.user_id,
                        userProfile: doc.data()
                    });
                }
            })
            .catch(err => {
                res.type('application/json');
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
                res.type('application/json');
                res.send({
                    succes: true,
                    user_id: ref.id
                });
            })
            .catch(err => {
                res.type('application/json');
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
                res.type('application/json');
                res.send({
                    succes: true,
                    msg: 'Update successful'
                });
            })
            .catch(err => {
                res.type('application/json');
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
                    res.type('application/json');
                    res.send({
                        success: true,
                        msg: 'User deleted.'
                    });
                } else {
                    res.type('application/json');
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