const Activity = require('../models/activity')


exports.createActivity = (username, type, description) => {
    const new_activity = new Activity({
        username,
        type,
        description
    })

    new_activity.save()
    .then(res => {
        console.log('successfully added new activity');
        }
    )
    .catch(err => console.log(err))
}


exports.deleteActivity = (id) => {
    Activity.findOneAndDelete(id)
    .then(res => console.log('activity deleted'))
    .catch(err => console.log(err))
}