module.exports = {
    "Query": {
        "RootNodeName": "EmployerRevisions",
        "Variables": {
            "Variable": [
                {
                    "@Name": "[EmployerKey]",
                    "@Value": "$$EmployerKey$$"
                }
            ]
        },
        "Groups": {
        	"Group": [
                {
                	"@GroupName": "Revisions",
                	"@ItemName": "Revision",
                	"@Selector": "/Employer/[EmployerKey]/Revisions",
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