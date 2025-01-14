import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [userType, setUserType] = useState("admin");
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [isVendor, setIsVendor] = useState(false);

    //Calender
    const [isCalender, setCalender] = useState(false);

    // Apps
    const [isEmail, setEmail] = useState(false);
    const [isSubEmail, setSubEmail] = useState(false);
    const [isEcommerce, setIsEcommerce] = useState(false);
    const [isProjects, setIsProjects] = useState(false);
    const [isTasks, setIsTasks] = useState(false);
    const [isCRM, setIsCRM] = useState(false);
    const [isCrypto, setIsCrypto] = useState(false);
    const [isInvoices, setIsInvoices] = useState(false);
    const [isSupportTickets, setIsSupportTickets] = useState(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
    const [isJobs, setIsJobs] = useState(false);
    const [isJobList, setIsJobList] = useState(false);
    const [isCandidateList, setIsCandidateList] = useState(false);


    // Authentication
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState(false);
    const [isLockScreen, setIsLockScreen] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [isVerification, setIsVerification] = useState(false);
    const [isError, setIsError] = useState(false);

    // Pages
    const [isProfile, setIsProfile] = useState(false);
    const [isLanding, setIsLanding] = useState(false);


    // Charts
    const [isApex, setIsApex] = useState(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState(false);
    const [isLevel2, setIsLevel2] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');
    // to show menu according to userRole
    
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/vendor")) {
      setUserType("vendor");
    } else if (path.startsWith("/user")) {
      setUserType("user");
    } else {
      setUserType("admin");
    }
  }, [location.pathname]);


    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Setting') {
            setIsSetting(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
        if (iscurrentState !== 'Vendor') {
            setIsVendor(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
    ]);

    const menuItems = [
      
        {
            label: "Admin",
        
            isHeader: true,
        },
      
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/admin/dashboard",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
          
        },
       
        {
            id: "authentication",
            // label: "Authentication",
            label: "Users",
            icon: "ri-account-circle-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsAuth(!isAuth);
                setIscurrentState('Auth');
                updateIconSidebar(e);
            },
            stateVariables: isAuth,
            subItems: [
                {
                    id: "signIn",
                    label: "Admin",
                    link: "#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsSignIn(!isSignIn);
                    },
                    parentId: "authentication",
                    stateVariables: isSignIn,
                    childItems: [
                        { id: 2, label: "Add Admin", link: "/admin/user-addadmin" },
                        { id: 1, label: "All Admin", link: "/admin/user-alladmin" },
                    ]
                },

                {
                    id: "signUp",
                    label: "Campaign Managers",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsSignUp(!isSignUp);
                    },
                    parentId: "authentication",
                    stateVariables: isSignUp,
                    childItems: [
                        { id: 1, label: "All CampaignManagers", link: "/admin/user-allcampaign-managers" },
                        { id: 2, label: "Add CampaignManager", link: "/admin/user-addcampaign-managers" },
                    ]
                },
                {
                    id: "passwordReset",
                    label: "Editors",
                    link: "/#",
                    // link: "/admin/editors",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsPasswordReset(!isPasswordReset);
                    },
                    parentId: "authentication",
                    stateVariables: isPasswordReset,
                    childItems: [
                        { id: 1, label: "All Editors", link: "/admin/user-alleditors" },
                        { id: 2, label: "Add Editor", link: "/admin/user-addeditors" },
                    ]
                },
                {
                    id: "alluser",
                    label: "All Users",

                    link: "/admin/user-allUsers",
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "authentication",
                    stateVariables: isProfile,

                }
             
            ],
        },
     
        {
            id: "Vendors",
            // label: "Pages",
            label: "Vendors",
            icon: "ri-pages-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsVendor(!isVendor);
                setIscurrentState('Vendor');
                updateIconSidebar(e);
            },
            
            stateVariables: isVendor,
            subItems: [
                
                {
                    id: "profile",
                    label: "All Vendors",
                    link: "/admin/all-vendors",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
               
                },
                { id: "team", label: "Review Vendor", link: "/admin/review-vendor", parentId: "pages" },
            
                
            ],
        },
        {
            id: "Category",
            label: "Category",
            icon: "ri-dashboard-2-line",
            link: "/#",
            stateVariables: isDashboard,
            subItems: [
               
                {
                    id: "profile",
                    label: "All Category",
                 
                    link: "/admin/all-category",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
                  
                },
                { id: "team", label: "Add Category", link: "/admin/add-category", parentId: "pages" },
             
            ],
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            
        },
        // {
        //     id: "WhitePapers",
        //     label: "WhitePapers",
        //     icon: "ri-dashboard-2-line",
        //     link: "/#",
        //     stateVariables: isDashboard,
        //     subItems: [
               
        //         {
        //             id: "profile",
        //             label: "All WhitePapers",
        //             link: "/all-whitepapers",
        //             // isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsStarter(!isStarter);
        //             },
        //             parentId: "pages",
        //             stateVariables: isProfile,
                 
        //         },
        //         { id: "whitePapers", label: "Add WhitePapers", link: "/add-whitepapers", parentId: "pages" },
        //         { id: "timeline", label: "Review WhitePapers", link: "/pages-timeline", parentId: "pages" },
              
        //     ],

            
        // },
        {
            id: "pages",
            // label: "Pages",
            label: "Whitepapers",
            icon: "ri-pages-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
            
            stateVariables: isPages,
            subItems: [
                
                {
                    id: "profile",
                    label: "All Whitepapers",
                    link: "/admin/all-whitepapers",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
               
                },
                { id: "team", label: "Add Whitepapers", link: "/admin/add-whitepapers", parentId: "pages" },
                {
                    id: "profile",
                    label: "Review Whitepaper",
                    link: "/admin/review-whitepapers",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
               
                },
                
            ],
        },
        {
            id: "Campaign",
            label: "Campaign",
            icon: "ri-compasses-2-line",
            
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsIcons(!isIcons);
                setIscurrentState('Icons');
                updateIconSidebar(e);
            },
            stateVariables: isIcons,
            subItems: [
                { id: "all-campaign", label: "All Campaign", link: "/admin/all-campaign", parentId: "icons" },
                { id: "add-campaign", label: "Add Campaign", link: "/admin/add-campaign", parentId: "icons" },
               
            ],
        },
        {
            id: "NewsLetters",
            label: "NewsLetters",
            icon: "ri-map-pin-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsMaps(!isMaps);
                setIscurrentState('Maps');
                updateIconSidebar(e);
            },
            stateVariables: isMaps,
            subItems: [
                { id: "all-news-letters", label: "All NewsLetters", link: "/all-news-letters", parentId: "maps" },
                 { id: "add-news-letters", label: "Add NewsLetters", link: "/add-news-letters", parentId: "icons" },
            ],
        },
        {
            id: "Blogs",
            label: "Blogs",
            icon: "ri-file-list-3-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsMultiLevel(!isMultiLevel);
                setIscurrentState('MuliLevel');
                updateIconSidebar(e);
            },

            stateVariables: isMultiLevel,
            subItems: [
                { id: "level1.1", label: "All blogs category", link: "/all-blogs-category", parentId: "multilevel" },
                {
                    id: "Level 1.2",
                    label: "Add blogs category",
                    link: "/add-blogs-category",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsLevel1(!isLevel1);
                    },
                    stateVariables: isLevel1,
            
                },
                {
                    id: "All Blogs",
                    label: "All blogs",
                    link: "/all-blogs",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsLevel1(!isLevel1);
                    },
                    stateVariables: isLevel1,
     
                },
              
                {
                    id: "add new Blogs",
                    label: "Add new Blogs",
                    link: "/add-new-blog",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsLevel1(!isLevel1);
                    },
                    stateVariables: isLevel1,
                
                },
               
            ],
        },
       
        /////////////////////////////////////////////////////////////////////////////////////////////
        // {
        //     id: "forms",
        //     label: "PDF Upload",
        //     icon: "ri-file-list-3-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsForms(!isForms);
        //         setIscurrentState('Forms');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isForms,
        //     subItems: [
        //         // { id: "basicelements", label: "Basic Elements", link: "/forms-elements", parentId: "forms" },
        //         // { id: "formselect", label: "Form Select", link: "/forms-select", parentId: "forms" },
        //         // { id: "checkboxsradios", label: "Checkboxs & Radios", link: "/forms-checkboxes-radios", parentId: "forms" },
        //         // { id: "pickers", label: "Pickers", link: "/forms-pickers", parentId: "forms" },
        //         // { id: "inputmasks", label: "Input Masks", link: "/forms-masks", parentId: "forms" },
        //         // { id: "advanced", label: "Advanced", link: "/forms-advanced", parentId: "forms" },
        //         // { id: "rangeslider", label: "Range Slider", link: "/forms-range-sliders", parentId: "forms" },
        //         // { id: "validation", label: "Validation", link: "/forms-validation", parentId: "forms" },
        //         // { id: "wizard", label: "Wizard", link: "/forms-wizard", parentId: "forms" },
        //         // { id: "editors", label: "Editors", link: "/forms-editors", parentId: "forms" },
        //         { id: "fileuploads", label: "File Uploads", link: "/whitepapers", parentId: "forms" },
        //         // { id: "formlayouts", label: "Form Layouts", link: "/forms-layouts", parentId: "forms" },
        //         // { id: "select2", label: "Select2", link: "/forms-select2", parentId: "forms" },
        //     ],
        // },
          /////////////////////////////////////////////////////////////////////////////////////////////
        
        {
            id: "Report",
            label: "Report",
            icon: "ri-pie-chart-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsCharts(!isCharts);
                setIscurrentState('Charts');
                updateIconSidebar(e);
            },
            stateVariables: isCharts,
            subItems: [





                {
                    id: "apexcharts",
                    label: "Campaign reports",
                    link: "/campaign-reports",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsApex(!isApex);
                    },
                    stateVariables: isApex,
                  
                },
                { id: "Newsletter report", label: "Newsletter reports", link: "/newsletter-reports", parentId: "charts" },
                { id: "Category report", label: "Category report", link: "/category-reports", parentId: "charts" },
                { id: "Whitepaper report", label: "Whitepaper report", link: "/whitepaper-reports", parentId: "charts" },

            ],
        },
        {
            id: "Setting",
            label: "Setting",
            icon: "ri-dashboard-2-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSetting(!isSetting);
                setIscurrentState('Setting');
                updateIconSidebar(e);
            },
            stateVariables: isSetting,
            subItems: [
                {
                    id: "Site setting",
                    label: "Site setting",
                    link: "/#",
                    // isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsApex(!isApex);
                    },
                    stateVariables: isApex,
                   
               
                },
                { id: "Home", label: "Home", link: "/charts-chartjs", parentId: "Setting" },
                
                     { id: "PrivecyPolicy", label: "Privacy Policy", link: "/", parentId: "Setting" },
                { id: "TermsCondition", label: "Terms Condition", link: "/", parentId: "Setting" },
                { id: "GDPR comlainces", label: "GDPR comlainces", link: "/", parentId: "Setting" },
                { id: "edit profile", label: "Edit profile", link: "/", parentId: "Setting" },

            ],
        },
        {
            label: "User",
        
            isHeader: true,
        },
        {
            id: "Userdashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/user/dashboard",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
          
        },
        {
            id: "SavedWhitePapers",
            label: "Saved WhitePapers",
            icon: "ri-bookmark-line",
            link: "/user/saved-whitepapers",
            stateVariables: isDashboard,    
        },
        {
            id: "DownloadedWhitePapers",
            label: "Downloaded Whitepapers",
            icon: "ri-download-cloud-line",
            link: "/user/downloaded-whitepapers",
            stateVariables: isDashboard,  
        },
        {
            id: "ViewedWhitePapers",
            label: "Viewed Whitepapers",
            icon: "ri-eye-line",
            link: "/user/viewed-whitepapers",
            stateVariables: isDashboard,  
        },
        {
            id: "NewsLetterSubsciber",
            label: "NewsLetter",
            icon: "ri-article-line",
            // link: "/user/newsletter-subsciber",
            link: "/user/news-letter",
            stateVariables: isDashboard,
           

            
        },
        {
            id: "profile",
            label: "Profile",
            link: "/user/profile",
            icon: "ri-account-circle-line",
            // isChildItem: true,
            click: function (e) {
                e.preventDefault();
                setIsProfile(!isProfile);
            },
            parentId: "pages",
            stateVariables: isProfile,
       
        },
        ////////////////////////////////////////////////////////
        {
            label: "Vendor",
        
            isHeader: true,
        },
        {
            id: "Vendordashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/vendor/dashboard",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
          
        },
        // {
        //     id: "Vendordashboard",
        //     // label: "Pages",
        //     label: "Whitepapers",
        //     icon: "ri-pages-line",
        //     link: "/vendor",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsPages(!isPages);
        //         setIscurrentState('Pages');
        //         updateIconSidebar(e);
        //     },
            
        //     stateVariables: isPages,
        //     subItems: [
                
        //         {
        //             id: "pages",
        //             label: "All Whitepapers",
        //             link: "/all-whitepapers",
        //             // isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsProfile(!isProfile);
        //             },
        //             parentId: "pages",
        //             stateVariables: isProfile,
               
        //         },
        //         { id: "team", label: "Add Whitepapers", link: "/add-whitepapers", parentId: "pages" },
                
        //     ],
        // },
        {
            id: "Vendordashboard",
            // label: "Pages",
            label: "Add Whitepapers",
            icon: "ri-pages-line",
            link: "/vendor/add-whitepapers",
            click: function (e) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
            
            stateVariables: isPages,
        
        },
        {
            id: "Vendordashboard",
            // label: "Pages",
            label: "All Whitepapers",
            icon: "ri-pages-line",
            link: "/vendor/all-whitepapers",
            subItems: [
               
                {
                    id: "profile",
                    label: "Whitepapers Submitted",
                 
                    link: "/vendor/all-whitepapers?status=",
                    click: function (e) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
                  
                },
                { id: "approved", label: "Whitepapers Approved", link: "/vendor/all-whitepapers?status=1", parentId: "pages" },
                { id: "pending", label: "Whitepapers Pending", link: "/vendor/all-whitepapers?status=2", parentId: "pages" },
                { id: "rejected", label: "Whitepapers Rejected", link: "/vendor/all-whitepapers?status=3", parentId: "pages" },
             
            ],
            click: function (e) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
            
            stateVariables: isPages,
        
        },
        {
            id: "profile",
            label: "Profile",
            link: "/vendor/profile",
            icon: "ri-account-circle-line",
            // isChildItem: true,
            click: function (e) {
                e.preventDefault();
                setIsProfile(!isProfile);
            },
            parentId: "pages",
            stateVariables: isProfile,
       
        },
        ////////////////////////////////////////////////////////
    ];
 const getFilteredMenuItems = () => {
  return menuItems.filter((item) => {
    if (userType === "vendor") {
      // Show only vendor-related items and headers
      return item.isHeader === true
        ? item.label === "Vendor"
        : item.link?.startsWith("/vendor") || (item.label === "Profile" && item.link?.startsWith("/vendor"));
    }

    if (userType === "user") {
      // Show only user-related items and headers
      return item.isHeader === true
        ? item.label === "User"
        : item.link?.startsWith("/user") || (item.label === "Profile" && item.link?.startsWith("/user"));
    }

    // For admin, show all items except user and vendor specific ones
 
    return !(item.isHeader === true
      ? item.label === "User" || item.label === "Vendor"
      : item.link?.startsWith("/user") || item.link?.startsWith("/vendor"));
 
  });
};

    
  
    // return <React.Fragment>{menuItems}</React.Fragment>;
    return <React.Fragment>{getFilteredMenuItems()}</React.Fragment>;

};



export default Navdata;