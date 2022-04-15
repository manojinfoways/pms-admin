/**
 * Authorization Roles
 */
const authRoles = {
    admin: ['admin',],
    staff: ['staff',],
    user: ['user',],
    researcher: ['researcher',],
    poster: [ 'poster', ],
    documentsAcceess: ['poster','admin','poster','admin','researcher'],
    onlyGuest: [],
};

export default authRoles;
