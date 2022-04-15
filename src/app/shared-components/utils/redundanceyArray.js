export const userRegistrationForm = [
	{
		name: 'firstname',
		label: 'First Name',
		type: 'text'
	},
	{
		name: 'lastname',
		label: 'Last Name',
		type: 'text'
	},
	{
		name: 'email',
		label: 'Email',
		type: 'text'
	},
	{
		name: 'password',
		label: 'Password',
		type: 'text'
	},
	 
];


export const propertyDescriptorForm = [
	{
		name: 'tract',
		label: 'Tract',
		type: 'text'
	},
	{
		name: 'block',
		label: 'Block',
		type: 'text'
	},
	{
		name: 'lot',
		label: 'Lot',
		type: 'text'
	},
	{
		name: 'unit',
		label: 'Unit',
		type: 'text'
	},
	{
		name: 'phase',
		label: 'Phase',
		type: 'text'
	},
	{
		name: 'increment',
		label: 'Increment',
		type: 'text'
	},
	{
		name: 'condo_name',
		label: 'Condo Name',
		type: 'text'
	},
	{
		name: 'condo',
		label: 'Condo Unit',
		type: 'text'
	},
	{
		name: 'area',
		label: 'Area',
		type: 'number'
	},
	{
		name: 'uom',
		label: 'Uom',
		type: 'text'
	},
	{
		name: 'estate_name',
		label: 'Estate Name',
		type: 'text'
	}
];

export const addTransactionType = [
	{
		name: 'transaction_value',
		label: 'Transaction Name',
		type: 'text'
	}
];

export const oneLineField = [
	{
		name: 'court_case_no',
		label: 'Court Case No',
		type: 'text'
	},
	{
		name: 'lien_no',
		label: 'Lien No',
		type: 'text'
	},
	{
		name: 'tax_no',
		label: 'Release No',
		type: 'text'
	}
];

export const recordFormMainFields = [
	{
		name: 'recording_fee',
		label: 'Recording Fee',
		type: 'number'
	},
	{
		name: 'execution_date',
		label: 'Execution Date (mm-dd-yyyy)',
		type: 'date'
	},
	{
		name: 'recorded_date',
		label: 'Recorded Date (mm-dd-yyyy)',
		type: 'date'
	},
	{
		name: 'mortgage',
		label: 'Mortgage',
		type: 'select',
		options: [
			{
				name: 'COMMERCIAL',
				value: 'COMMERCIAL'
			},
			{
				name: 'RESIDENTIAL VA',
				value: 'RESIDENTIAL VA'
			},
			{
				name: 'RESIDENTIAL GUAM HOUSING',
				value: 'RESIDENTIAL GUAM HOUSING'
			},
			{
				name: 'RESIDENTIAL USDA DIRECT',
				value: 'RESIDENTIAL USDA DIRECT'
			},
			{
				name: 'RESIDENTIAL CONVENTIONAL',
				value: 'RESIDENTIAL CONVENTIONAL'
			},
			{
				name: 'PRIVATE',
				value: 'PRIVATE'
			},
			{
				name: 'EQUITY LINE/ HELOC',
				value: 'EQUITY LINE/ HELOC'
			},
			{
				name: 'CONSTRUCTION MORTGAGE',
				value: 'CONSTRUCTION MORTGAGE'
			}
		].sort((a,b)=> (a.name > b.name ? 1 : -1))
	},
	{
		name: 'lender_name',
		label: 'Banks/Lender',
		type: 'mortgage_lender_type'
	},
	{
		name: 'mortgage_amount',
		label: 'Mortgage Amount',
		type: 'number'
	},
	{
		name: 'maturity_date',
		label: 'Maturity Date (mm-dd-yyyy)',
		type: 'date'
	},
	{
		name: 'porptery_descriptor',
		label: 'Property Descriptor',
		type: 'porptery_descriptor'
	},
	{
		name: 'estate_no',
		label: 'Estate No',
		type: 'text'
	},
	{
		name: 'lm_check_no',
		label: 'LM Check No (XXXFYXXXX)',
		type: 'text'
	},
	{
		name: 'certificate_references',
		label: 'Certificate of Title/ Guaranteed Claim',
		type: 'text'
	},
	{
		name: 'document_references',
		label: 'Document Reference',
		type: 'text'
	},
	{
		name: 'closing_party',
		label: 'Closing Party',
		type: 'text'
	},
	{
		name: 'ownership_type',
		label: 'Ownership Type',
		type: 'select',
		options: [
			{
				name: 'PRIVATE',
				value: 'PRIVATE'
			},
			{
				name: 'GOVGUAM',
				value: 'GOVGUAM'
			},
			{
				name: 'FEDERAL',
				value: 'FEDERAL'
			},
			{
				name: 'UNKNOWN',
				value: 'UNKNOWN'
			}
		].sort((a,b)=> (a.name > b.name ? 1 : -1))
	},

	{
		name: 'cluster',
		label: 'Cluster',
		type: 'text'
	},

	{
		name: 'doc_signed_date',
		label: 'Signed Date (mm-dd-yyyy)',
		type: 'date'
	}
];

export const PropertyTaxForm = [
	{
		name: 'tax_year',
		label: 'Tax Year',
		type: 'number'
	},
	{
		name: 'land_tax',
		label: 'Land Tax',
		type: 'currency'
	},
	{ name: 'bldg_tax', label: 'Building Tax', type: 'currency' },
	{ name: 'year_built', label: 'Year Built', type: 'number' },
	{ name: 'bldg_condition', label: 'Building Condition', type: 'text' },
	{ name: 'bldg_sf', label: 'Building Sf', type: 'number' },
	{ name: 'land_appraised', label: 'Land Appraised', type: 'currency' },
	{ name: 'bldg_appraised', label: 'Building Appraised', type: 'currency' },
	{ name: 'property_tax_due', label: 'Property Tax Due', type: 'currency' },
	{ name: 'property_tax_remarks', label: 'Property Text Remarks', type: 'textarea' }
];
