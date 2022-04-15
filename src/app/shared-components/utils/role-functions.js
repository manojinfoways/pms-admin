 
export const isGranted = (role, access) => {
	let permission = true;
	if (role == 'user') {
		if (access == 'create' || access=='update') {
			permission = false
		}
	} else if (role=='researchers') {
		if (access == 'create' || access=='update') {
			permission = false
		}
	} else {
		
	}
	return permission;
};
 
 
export const isGrantedDocument = (role, access) => {
	let permission = false;
	if (role == 'user') {
		if (access == 'create' || access=='update' || access=='list' || access =='note') {
			permission = true
		}
	} else if (role=='researcher') {
		if ( access =='note') {
			permission = true
		}
	} else if (role=='poster') {
		if (access == 'create' || access=='update' || access=='list' || access =='note') {
			permission = true
		}
	} else if (role == 'staff') {
		if (access == 'create' || access == 'update' || access =='note' ) {
			permission = true
		}
	} else if (role=='admin') {
		return true;
	} else {
		
	}
	
	return permission;
};