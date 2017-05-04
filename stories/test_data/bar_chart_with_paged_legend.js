const config = {
    type: 'column',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/9211',
                    title: '_Close [BOP]',
                    measureFilters: [],
                    showInPercent: false,
                    showPoP: false
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'attribute',
                    collection: 'view',
                    attribute: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/969',
                    displayForm: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/970'
                }
            }, {
                category: {
                    type: 'attribute',
                    collection: 'stack',
                    attribute: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/969',
                    displayForm: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/970'
                }
            }
        ],
        filters: [
            {
                listAttributeFilter: {
                    attribute: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/969',
                    displayForm: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/970',
                    default: {
                        negativeSelection: true,
                        attributeElements: []
                    }
                }
            }
        ]
    }
};

const data = {
    isLoaded: true,
    headers: [
        {
            type: 'attrLabel',
            id: 'label.account.id.name',
            uri: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/970',
            title: 'Account'
        }, {
            type: 'attrLabel',
            id: 'label.account.id.name',
            uri: '/gdc/md/oim7k9wbfmhq1xcpbuwvr41pl7ztaat7/obj/970',
            title: 'Account'
        }, {
            type: 'metric',
            id: 'e933f8989a54e8a1d842a30b15c9c074',
            title: '_Close [BOP]',
            format: '#,##0.00'
        }
    ],
    rawData: [
        [
            '101 Financial', '101 Financial', '40646'
        ],
        [
            '1-800 We Answer', '1-800 We Answer', '40416'
        ],
        [
            '1-888-OhioComp', '1-888-OhioComp', '40463'
        ],
        [
            '1 Source Consulting', '1 Source Consulting', '40416'
        ],
        [
            '1st Choice Staffing & Consulting', '1st Choice Staffing & Consulting', '40480'
        ],
        [
            '352 Media Group', '352 Media Group', '40470'
        ],
        [
            '3Degrees', '3Degrees', '40420'
        ],
        [
            '49er Communications', '49er Communications', '40416'
        ],
        [
            '4th Source', '4th Source', '40462'
        ],
        [
            '5LINX Enterprises', '5LINX Enterprises', '40521'
        ],
        [
            '6K Systems', '6K Systems', '40455'
        ],
        [
            '720 Strategies', '720 Strategies', '40420'
        ],
        [
            '7-Eleven', '7-Eleven', '41013'
        ],
        [
            '90octane', '90octane', '40501'
        ],
        [
            'A10 Clinical Solutions', 'A10 Clinical Solutions', '40626'
        ],
        [
            'A10 Networks', 'A10 Networks', '40334'
        ],
        [
            'A-1 Textiles', 'A-1 Textiles', '40371'
        ],
        [
            "Aaron's Sales & Lease Ownership", "Aaron's Sales & Lease Ownership", '40359'
        ],
        [
            'AArrow Advertising', 'AArrow Advertising', '40526'
        ],
        [
            'Aasent Mortgage Corporation', 'Aasent Mortgage Corporation', '40633'
        ],
        [
            'ABBTech Staffing Services', 'ABBTech Staffing Services', '40498'
        ],
        [
            'ABCOMRents.com', 'ABCOMRents.com', '40500'
        ],
        [
            'A.B. Data', 'A.B. Data', '40416'
        ],
        [
            'Able Equipment Rental', 'Able Equipment Rental', '40416'
        ],
        [
            'Abstract Displays', 'Abstract Displays', '40346'
        ],
        [
            'Accelerated Financial Solutions', 'Accelerated Financial Solutions', '40554'
        ],
        [
            'Access America Transport', 'Access America Transport', '40351'
        ],
        [
            'Access Information Management', 'Access Information Management', '40507'
        ],
        [
            'Access Insurance Holdings', 'Access Insurance Holdings', '40431'
        ],
        [
            'Access Worldwide', 'Access Worldwide', '40466'
        ],
        [
            'Accordent', 'Accordent', '40368'
        ],
        [
            'AccountNow', 'AccountNow', '40652'
        ],
        [
            'adaQuest', 'adaQuest', '40412'
        ],
        [
            'Adperio', 'Adperio', '40341'
        ],
        [
            'Advanced Logistics', 'Advanced Logistics', '40381'
        ],
        [
            'Advent Global Solutions', 'Advent Global Solutions', '40507'
        ],
        [
            'Advisors Asset Management', 'Advisors Asset Management', '40381'
        ],
        [
            'Advisors Mortgage Group', 'Advisors Mortgage Group', '40350'
        ],
        [
            'AEEC', 'AEEC', '40388'
        ],
        [
            'Aeneas Internet and Telephone', 'Aeneas Internet and Telephone', '40374'
        ],
        [
            'Aerial Services', 'Aerial Services', '40689'
        ],
        [
            'Aerodyn Engineering', 'Aerodyn Engineering', '40531'
        ],
        [
            'Aerospace & Commercial Technologies', 'Aerospace & Commercial Technologies', '40535'
        ],
        [
            'agencyQ', 'agencyQ', '40622'
        ],
        [
            'AgileThought', 'AgileThought', '40388'
        ],
        [
            'Aircraft Cabin Systems', 'Aircraft Cabin Systems', '40351'
        ],
        [
            'AIRSIS', 'AIRSIS', '40359'
        ],
        [
            'AirSplat', 'AirSplat', '40507'
        ],
        [
            'AJ Riggins', 'AJ Riggins', '40506'
        ],
        [
            'AK Environmental', 'AK Environmental', '40437'
        ],
        [
            'Akraya', 'Akraya', '40381'
        ],
        [
            'ALaS Consulting', 'ALaS Consulting', '40511'
        ],
        [
            'Algonquin Advisors', 'Algonquin Advisors', '40655'
        ],
        [
            'Ali International', 'Ali International', '40443'
        ],
        [
            'All American Rentals', 'All American Rentals', '40381'
        ],
        [
            'All American Swim Supply', 'All American Swim Supply', '40381'
        ],
        [
            'Allconnect', 'Allconnect', '40541'
        ],
        [
            'Alliance Benefit Group of Illinois', 'Alliance Benefit Group of Illinois', '40398'
        ],
        [
            'Alpha Card Services', 'Alpha Card Services', '40402'
        ],
        [
            'Alpha Imaging', 'Alpha Imaging', '40511'
        ],
        [
            'Alpha Source', 'Alpha Source', '40416'
        ],
        [
            'Altour', 'Altour', '40420'
        ],
        [
            'Ambit Energy', 'Ambit Energy', '40498'
        ],
        [
            "Amelia's", "Amelia's", '40507'
        ],
        [
            'Amensys', 'Amensys', '40416'
        ],
        [
            'American Broadband', 'American Broadband', '40381'
        ],
        [
            'American Technologies', 'American Technologies', '40353'
        ],
        [
            'American Tire Distributors', 'American Tire Distributors', '40400'
        ],
        [
            'American Unit', 'American Unit', '40411'
        ],
        [
            'Ameri-Kleen', 'Ameri-Kleen', '40406'
        ],
        [
            'An Amazing Organization', 'An Amazing Organization', '40409'
        ],
        [
            'Animax Entertainment', 'Animax Entertainment', '40388'
        ],
        [
            'Anthem Media Group', 'Anthem Media Group', '40387'
        ],
        [
            'AnytimeCostumes.com', 'AnytimeCostumes.com', '40342'
        ],
        [
            'Anytime Fitness', 'Anytime Fitness', '40385'
        ],
        [
            'APCO Worldwide', 'APCO Worldwide', '40511'
        ],
        [
            'APEXteriors', 'APEXteriors', '40353'
        ],
        [
            'Apparatus', 'Apparatus', '40353'
        ],
        [
            'Applied Analytics', 'Applied Analytics', '40388'
        ],
        [
            'Applied Data', 'Applied Data', '40373'
        ],
        [
            'Applied Digital Solutions', 'Applied Digital Solutions', '40356'
        ],
        [
            'AppRiver', 'AppRiver', '40409'
        ],
        [
            'Apptis', 'Apptis', '40417'
        ],
        [
            'Aptera Software', 'Aptera Software', '40361'
        ],
        [
            'Aquifer Solutions', 'Aquifer Solutions', '40361'
        ],
        [
            'ArcaMax Publishing', 'ArcaMax Publishing', '40360'
        ],
        [
            'Archimedes Global', 'Archimedes Global', '40442'
        ],
        [
            'Archway Technology Partners', 'Archway Technology Partners', '40360'
        ],
        [
            'Arent Fox', 'Arent Fox', '40373'
        ],
        [
            'Arizon Companies', 'Arizon Companies', '40409'
        ],
        [
            'Arkadin', 'Arkadin', '40535'
        ],
        [
            'A.R.M. Solutions', 'A.R.M. Solutions', '40630'
        ],
        [
            'Arona', 'Arona', '40345'
        ],
        [
            'Array Information Technology', 'Array Information Technology', '40353'
        ],
        [
            'Arrowhead Advertising', 'Arrowhead Advertising', '40401'
        ],
        [
            'ArrowStream', 'ArrowStream', '40420'
        ],
        [
            'Artemis Laser and Vein Center', 'Artemis Laser and Vein Center', '40351'
        ],
        [
            'Ascendent Engineering & Safety Solutions', 'Ascendent Engineering & Safety Solutions', '40498'
        ],
        [
            'ASD', 'ASD', '40379'
        ],
        [
            'ASE Technology', 'ASE Technology', '40465'
        ],
        [
            'ASI System Integration', 'ASI System Integration', '40727'
        ],
        [
            'ASK Staffing', 'ASK Staffing', '40786'
        ],
        [
            'Aspen Exteriors', 'Aspen Exteriors', '40374'
        ],
        [
            'Aspen Transportation', 'Aspen Transportation', '40360'
        ],
        [
            'A Squared Group', 'A Squared Group', '40399'
        ],
        [
            'Astor & Black Custom Clothiers', 'Astor & Black Custom Clothiers', '40534'
        ],
        [
            'A-T Solutions', 'A-T Solutions', '40361'
        ],
        [
            'Austin GeoModeling', 'Austin GeoModeling', '40331'
        ],
        [
            'AutoClaims Direct', 'AutoClaims Direct', '40416'
        ],
        [
            'Avalon Global Solutions', 'Avalon Global Solutions', '40580'
        ],
        [
            'Avisena', 'Avisena', '40498'
        ],
        [
            'Aware Web Solutions', 'Aware Web Solutions', '40388'
        ],
        [
            'A White Orchid Wedding', 'A White Orchid Wedding', '40479'
        ],
        [
            'AWSI', 'AWSI', '40360'
        ],
        [
            'AXIA Consulting', 'AXIA Consulting', '40437'
        ],
        [
            'B2B CFO', 'B2B CFO', '40360'
        ],
        [
            'BackOffice Associates', 'BackOffice Associates', '40426'
        ],
        [
            'BACtrack Breathalyzers', 'BACtrack Breathalyzers', '40625'
        ],
        [
            'Bailey Kennedy', 'Bailey Kennedy', '40372'
        ],
        [
            'Bamco', 'Bamco', '40413'
        ],
        [
            'BandCon', 'BandCon', '40444'
        ],
        [
            'Bankers Healthcare Group', 'Bankers Healthcare Group', '40659'
        ],
        [
            'Barhorst Insurance Group', 'Barhorst Insurance Group', '40434'
        ],
        [
            'Baseball Rampage', 'Baseball Rampage', '40388'
        ],
        [
            'Batteries Plus', 'Batteries Plus', '40661'
        ],
        [
            'Battle Resource Management', 'Battle Resource Management', '40496'
        ],
        [
            'Beacon Partners', 'Beacon Partners', '40395'
        ],
        [
            'BEAR Data Systems', 'BEAR Data Systems', '40389'
        ],
        [
            'Behavioral Health Group', 'Behavioral Health Group', '40505'
        ],
        [
            'Belmont Labs', 'Belmont Labs', '40376'
        ],
        [
            'Benham Real Estate Group', 'Benham Real Estate Group', '40376'
        ],
        [
            'Best Practice Systems', 'Best Practice Systems', '40406'
        ],
        [
            'Best Rate Referrals', 'Best Rate Referrals', '40406'
        ],
        [
            'Best Upon Request', 'Best Upon Request', '40345'
        ],
        [
            'BeyondTrust', 'BeyondTrust', '40416'
        ],
        [
            'BidSync', 'BidSync', '40388'
        ],
        [
            'BigMachines', 'BigMachines', '40388'
        ],
        [
            'BIGresearch', 'BIGresearch', '40388'
        ],
        [
            'Biosearch Technologies', 'Biosearch Technologies', '40372'
        ],
        [
            'Bizzuka', 'Bizzuka', '40373'
        ],
        [
            'Blacklist', 'Blacklist', '40419'
        ],
        [
            "Blaser's USA", "Blaser's USA", '40361'
        ],
        [
            'Blitz', 'Blitz', '40388'
        ],
        [
            'Blue C Advertising', 'Blue C Advertising', '40420'
        ],
        [
            'Blue Cod Technologies', 'Blue Cod Technologies', '40420'
        ],
        [
            'Blurb', 'Blurb', '40404'
        ],
        [
            'BluWater Consulting', 'BluWater Consulting', '40404'
        ],
        [
            'Body Central', 'Body Central', '40464'
        ],
        [
            "Bojangles' Restaurants, Inc.", "Bojangles' Restaurants, Inc.", '40379'
        ],
        [
            'Booksfree.com', 'Booksfree.com', '40542'
        ],
        [
            'Booz Allen Hamilton', 'Booz Allen Hamilton', '40416'
        ],
        [
            'BOSH Global Services', 'BOSH Global Services', '40388'
        ],
        [
            'Boston Interactive', 'Boston Interactive', '40499'
        ],
        [
            'Bracewell & Giuliani', 'Bracewell & Giuliani', '40450'
        ],
        [
            'Breaking Ground Contracting', 'Breaking Ground Contracting', '40450'
        ],
        [
            'B Resource', 'B Resource', '40416'
        ],
        [
            'BridgePoint Technologies', 'BridgePoint Technologies', '40450'
        ],
        [
            'Brighton Cromwell', 'Brighton Cromwell', '40388'
        ],
        [
            'BrightStar Care', 'BrightStar Care', '40373'
        ],
        [
            'Brightway Insurance', 'Brightway Insurance', '40498'
        ],
        [
            'Brilliant Environmental Services', 'Brilliant Environmental Services', '40339'
        ],
        [
            'Bronto Software', 'Bronto Software', '40360'
        ],
        [
            'Brooklyn Brewery', 'Brooklyn Brewery', '40386'
        ],
        [
            'Bug Doctor', 'Bug Doctor', '40506'
        ],
        [
            'Camp Bow Wow', 'Camp Bow Wow', '40633'
        ],
        [
            'Cantaloupe Systems', 'Cantaloupe Systems', '40400'
        ],
        [
            'Canyon Manufacturing Services', 'Canyon Manufacturing Services', '40570'
        ],
        [
            'Cape Medical Supply', 'Cape Medical Supply', '40389'
        ],
        [
            'Capps Manufacturing', 'Capps Manufacturing', '40450'
        ],
        [
            '(mt) Media Temple', '(mt) Media Temple', '40416'
        ]
    ],
    warnings: [],
    isEmpty: false,
    isLoading: false
};

export default {
    config,
    data
};
