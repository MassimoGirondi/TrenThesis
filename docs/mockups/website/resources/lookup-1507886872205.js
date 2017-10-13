(function(window, undefined) {
  var dictionary = {
    "2f388c76-5a45-48ee-9cc6-6b5f6a98222a": "View ideas",
    "3eaeb2e9-0c44-4b2b-b56a-2fbad827b260": "Statistics",
    "fb608b3d-85f1-4748-8a99-d9665ecc16e4": "Profile",
    "fabeff08-f8a0-4a33-b76e-0aa37c295062": "Assigned idea",
    "913a6086-8551-4f03-a3ad-761953b0929b": "Request",
    "32b84747-9e29-4e91-9442-0515f3fab0ad": "Preferences",
    "f423301d-1d40-4482-9c1b-e3d6ba8f2fc2": "Statistics - University",
    "86402d61-6f3a-48a7-adf0-65df180fc62b": "View requests",
    "84a9a013-680c-437a-9f16-71e0544b6c0f": "Students",
    "6b50f51e-4b67-43d9-9df7-c267e9164ec8": "New idea",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Home page",
    "2f2316fb-795c-4cfd-8720-617ef7b00490": "View assigned ideas",
    "73626206-d5db-4569-9e11-d656ebb956e3": "Idea",
    "10f2a027-8979-4cc0-990f-0167f9a97f88": "Logout",
    "87db3cf7-6bd4-40c3-b29c-45680fb11462": "960 grid - 16 columns",
    "e5f958a4-53ae-426e-8c05-2f7d8e00b762": "960 grid - 12 columns",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);