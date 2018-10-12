module.exports = {
    "Query": {
        "RootNodeName": "EmployeeRevisions",
        "Variables": {
            "Variable": [
                {
                    "@Name": "[EmployerKey]",
                    "@Value": "$$EmployerKey$$"
                },                
                {
                    "@Name": "[EmployeeKey]",
                    "@Value": "$$EmployeeKey$$"
                }
            ]
        },
        "Groups": {
            "Group": [
                {
                    "@GroupName": "Revisions",
                    "@ItemName": "Revision",
                    "@Selector": "/Employer/[EmployerKey]/Employee/[EmployeeKey]/Revisions",
                    "Output": [
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "EffectiveDate",
                            "@Property": "EffectiveDate",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Revision",
                            "@Property": "Revision"
                        }
                    ],
                    "Order": [
                        {
                            "@xsi:type": "Descending",
                            "@Property": "Revision"
                        }
                    ]
                }
            ]
        }
    }
};