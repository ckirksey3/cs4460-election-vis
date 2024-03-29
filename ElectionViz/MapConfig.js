
   var g_map_backgroundColor = "black";        // background to draw map on
   var g_map_borderColor = "white";            // state border color  
   var g_map_highlightBorderColor = "yellow";  // highlighted state border color

   var g_map_baseRGB = [128,128,128];          // state color default
   var g_map_highlightRGB = [0,100,200];       // state color when highlighted

   var g_map_infoBoxFillRGB   = [0,0,0];       // info box background color
   var g_map_infoBoxBorderRGB = [255,255,255]; // info box border color
   var g_map_infoBoxTextRGB   = [255,255,255]; // info box text color

   var g_map_useInfoBox = true;  // default to use the info box for all states
   var g_map_isIE9 = false;      // must detect IE9 for proper mouse position

 
   // BASIC PROPRETIES
   // FIELD                     TYPE              DESCRIPTION
   // =====                     ====              ===========
   // myBorderColor             CSS style color   i.e. "white"  border color
   // myHighlightBorderColor    CSS style color   highlighted border
   // myHighlightRGB            3D array          [r,g,b] highlighted state 
   // myBaseRGB                 3D array                  when not highlighted
   // 
   // myUseInfoBox              boolean           default = true
   // myInfoBoxFillRGB          3D array          info box background
   // myInfoBoxBorderRGB        3D array          info box border
   // myInfoBoxTextRGB          3D array          info box text color
   //                                             
   //
   // setInfoBoxText(t)         t = the text to put into the info box 
   // addInfoBoxText(t)         t = append a new line of text to the info box
   //
   // myInfoBoxOrigin           2D array          default = [625,290]
   // myInfoBoxWidth            integer           default = 174 
   // myInfoBoxHeight           integer           default = 160
   // myInfoBoxTextHeight       integer=12        you must change this if you
   //                                             alter the font of the canvas
   //
   // myClickCallback           function          set this to your own callback
   //                                             invoked when state is clicked
   //
   // updateColor(highlight)    function          call this function after you
   //                                             have changed color settings
   //                                             within your custom click cb
   //                                             to make the map render them
   //                                             set 'highlight' (boolean)
   //                                             the current state should be
   //                                             filled highlighted or not
   //                                             
   // READ ONLY PROPERTIES
   // ====================
   // myAbbrev                  string            postal code, i.e. "FL"
   // myCapsName                string            name in all caps, "FLORIDA"
   // myPrettyName              string            prettier name, "Florida"
   //
   
   var g_map_stateMap = null;

   // global vars for direct access to canvas
   
   var g_map_canvas;
   var g_map_context;
   var g_map_renderInterval;


   // Called during loading, put config code here

   var evMap = new Object();

   var states = new Array("AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL",
                     "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
                     "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
                   "UT", "VT", "VA", "WA", "WV", "WI", "WY");
  var votes = new Array(9, 3, 11, 6, 55, 9, 7, 3, 3, 29, 16, 4, 4, 20, 11, 6, 6, 8, 8, 4, 10, 11, 16, 10, 6, 10, 
               3, 5, 6, 4, 14, 5, 29, 15, 3, 18, 7, 7, 20, 4, 9, 3, 11, 38, 6, 3, 13, 12, 5, 10, 3);

   
   function map_userSetup()
   {
      var isRed = true;
      var i = 0;
      for(var abbrev in states)
      {
         evMap[states[abbrev]] = votes[i];
         //document.write(states[abbrev] + " (" + votes[i] + ") "); 
         i++;
      }
      for ( var abbrev in g_map_stateMap )
      {
         var state = g_map_stateMap[abbrev]; 
         var nameAndAbbrev = state.myPrettyName + "  (" + state.myAbbrev + ")";

         //state.myBaseRGB = [255, 0, 0];

         state.setInfoBoxText(nameAndAbbrev);
         state.addInfoBoxText(""); // add a blank line

         g_map_stateMap[abbrev].myBaseRGB = [evMap[abbrev]*15,0,0];
         g_map_stateMap[abbrev].addInfoBoxText("Electoral Votes: " + evMap[abbrev]);
         /*if(isRed)
         {
            g_map_stateMap[abbrev].myBaseRGB = [evMap[abbrev]*10,0,0];
            g_map_stateMap[abbrev].myHighlightRGB = [255,0,0];
            isRed = false;
         }
         else
         {
            g_map_stateMap[abbrev].myBaseRGB = [0,0,255];
            g_map_stateMap[abbrev].myHighlightRGB = [255,0,0];
            isRed = true;
         }*/
      }

      for(var i = 0;  i<56; i= i+5)
      {
         document.getElementById("map_key").innerHTML += "<span style='color:rgb(" + i*10 + ",0,0)'>" + i + " </span>";
      }      

      g_map_stateMap["AL"].addInfoBoxText("Population: 4,802,982");
      g_map_stateMap["AK"].addInfoBoxText("Population: 721,523");
      g_map_stateMap["AZ"].addInfoBoxText("Population: 6,412,700");
      g_map_stateMap["AR"].addInfoBoxText("Population: 2,926,229");
      g_map_stateMap["CA"].addInfoBoxText("Population: 37,341,989");
      g_map_stateMap["CO"].addInfoBoxText("Population: 4,939,456");
      g_map_stateMap["CT"].addInfoBoxText("Population: 3,581,628");
      g_map_stateMap["DC"].addInfoBoxText("Population: 601,723");
      g_map_stateMap["DE"].addInfoBoxText("Population: 900,877");
      g_map_stateMap["FL"].addInfoBoxText("Population: 18,900,773");
      g_map_stateMap["GA"].addInfoBoxText("Population: 9,727,566");
      g_map_stateMap["HI"].addInfoBoxText("Population: 1,366,862");
      g_map_stateMap["ID"].addInfoBoxText("Population: 1,573,499");
      g_map_stateMap["IL"].addInfoBoxText("Population: 12,864,380");
      g_map_stateMap["IN"].addInfoBoxText("Population: 6,501,582");
      g_map_stateMap["IA"].addInfoBoxText("Population: 3,053,787");
      g_map_stateMap["KS"].addInfoBoxText("Population: 2,863,813");
      g_map_stateMap["KY"].addInfoBoxText("Population: 4,350,606");
      g_map_stateMap["LA"].addInfoBoxText("Population: 4,553,962");
      g_map_stateMap["ME"].addInfoBoxText("Population: 1,333,074");
      g_map_stateMap["MD"].addInfoBoxText("Population: 5,789,929");
      g_map_stateMap["MA"].addInfoBoxText("Population: 6,559,644");
      g_map_stateMap["MI"].addInfoBoxText("Population: 9,911,626");
      g_map_stateMap["MN"].addInfoBoxText("Population: 5,314,879");
      g_map_stateMap["MS"].addInfoBoxText("Population: 2,978,240");
      g_map_stateMap["MO"].addInfoBoxText("Population: 6,011,478");
      g_map_stateMap["MT"].addInfoBoxText("Population: 994,416");
      g_map_stateMap["NE"].addInfoBoxText("Population: 1,831,825");
      g_map_stateMap["NV"].addInfoBoxText("Population: 2,709,432");
      g_map_stateMap["NH"].addInfoBoxText("Population: 1,321,445");
      g_map_stateMap["NJ"].addInfoBoxText("Population: 8,807,501");
      g_map_stateMap["NM"].addInfoBoxText("Population: 2,067,273");
      g_map_stateMap["NY"].addInfoBoxText("Population: 19,421,055");
      g_map_stateMap["NC"].addInfoBoxText("Population: 9,565,781");
      g_map_stateMap["ND"].addInfoBoxText("Population: 675,905");
      g_map_stateMap["OH"].addInfoBoxText("Population: 11,568,495");
      g_map_stateMap["OK"].addInfoBoxText("Population: 3,764,882");
      g_map_stateMap["OR"].addInfoBoxText("Population: 3,848,606");
      g_map_stateMap["PA"].addInfoBoxText("Population: 12,734,905");
      g_map_stateMap["RI"].addInfoBoxText("Population: 1,055,247");
      g_map_stateMap["SC"].addInfoBoxText("Population: 4,645,975");
      g_map_stateMap["SD"].addInfoBoxText("Population: 819,761");
      g_map_stateMap["TN"].addInfoBoxText("Population: 6,375,431");
      g_map_stateMap["TX"].addInfoBoxText("Population: 25,268,418");
      g_map_stateMap["UT"].addInfoBoxText("Population: 2,770,765");
      g_map_stateMap["VT"].addInfoBoxText("Population: 630,337");
      g_map_stateMap["VA"].addInfoBoxText("Population: 8,037,736");
      g_map_stateMap["WA"].addInfoBoxText("Population: 6,753,369");
      g_map_stateMap["WV"].addInfoBoxText("Population: 1,859,815");
      g_map_stateMap["WI"].addInfoBoxText("Population: 5,698,230");
      g_map_stateMap["WY"].addInfoBoxText("Population: 568,300");
      
      g_map_stateMap["DC"].addInfoBoxText("Capital: National Capital");
      g_map_stateMap["AL"].addInfoBoxText("Capital: Montgomery");
      g_map_stateMap["AK"].addInfoBoxText("Capital: Juneau");
      g_map_stateMap["AZ"].addInfoBoxText("Capital: Phoenix");
      g_map_stateMap["AR"].addInfoBoxText("Capital: Little Rock");
      g_map_stateMap["CA"].addInfoBoxText("Capital: Sacramento");
      g_map_stateMap["CO"].addInfoBoxText("Capital: Denver");
      g_map_stateMap["CT"].addInfoBoxText("Capital: Hartford");
      g_map_stateMap["DE"].addInfoBoxText("Capital: Dover");
      g_map_stateMap["FL"].addInfoBoxText("Capital: Tallahassee");
      g_map_stateMap["GA"].addInfoBoxText("Capital: Atlanta");
      g_map_stateMap["HI"].addInfoBoxText("Capital: Honolulu");
      g_map_stateMap["ID"].addInfoBoxText("Capital: Boise");
      g_map_stateMap["IL"].addInfoBoxText("Capital: Springfield");
      g_map_stateMap["IN"].addInfoBoxText("Capital: Indianapolis");
      g_map_stateMap["IA"].addInfoBoxText("Capital: Des Moines");
      g_map_stateMap["KS"].addInfoBoxText("Capital: Topeka");
      g_map_stateMap["KY"].addInfoBoxText("Capital: Frankfort");
      g_map_stateMap["LA"].addInfoBoxText("Capital: Baton Rouge");
      g_map_stateMap["ME"].addInfoBoxText("Capital: Augusta");
      g_map_stateMap["MD"].addInfoBoxText("Capital: Annapolis");
      g_map_stateMap["MA"].addInfoBoxText("Capital: Boston");
      g_map_stateMap["MI"].addInfoBoxText("Capital: Lansing");
      g_map_stateMap["MN"].addInfoBoxText("Capital: St. Paul");
      g_map_stateMap["MS"].addInfoBoxText("Capital: Jackson");
      g_map_stateMap["MO"].addInfoBoxText("Capital: Jefferson");
      g_map_stateMap["MT"].addInfoBoxText("Capital: Helena");
      g_map_stateMap["NE"].addInfoBoxText("Capital: Lincoln");
      g_map_stateMap["NV"].addInfoBoxText("Capital: Carson City");
      g_map_stateMap["NH"].addInfoBoxText("Capital: Concord");
      g_map_stateMap["NJ"].addInfoBoxText("Capital: Trenton");
      g_map_stateMap["NM"].addInfoBoxText("Capital: Santa Fe");
      g_map_stateMap["NY"].addInfoBoxText("Capital: Albany");
      g_map_stateMap["NC"].addInfoBoxText("Capital: Raleigh");
      g_map_stateMap["ND"].addInfoBoxText("Capital: Bismarck");
      g_map_stateMap["OH"].addInfoBoxText("Capital: Columbus");
      g_map_stateMap["OK"].addInfoBoxText("Capital: Oklahoma City");
      g_map_stateMap["OR"].addInfoBoxText("Capital: Salem");
      g_map_stateMap["PA"].addInfoBoxText("Capital: Harrisburg");
      g_map_stateMap["RI"].addInfoBoxText("Capital: Providence");
      g_map_stateMap["SC"].addInfoBoxText("Capital: Columbia");
      g_map_stateMap["SD"].addInfoBoxText("Capital: Pierre");
      g_map_stateMap["TN"].addInfoBoxText("Capital: Nashville");
      g_map_stateMap["TX"].addInfoBoxText("Capital: Austin");
      g_map_stateMap["UT"].addInfoBoxText("Capital: Salt Lake City");
      g_map_stateMap["VT"].addInfoBoxText("Capital: Montpelier");
      g_map_stateMap["VA"].addInfoBoxText("Capital: Richmond");
      g_map_stateMap["WA"].addInfoBoxText("Capital: Olympia");
      g_map_stateMap["WV"].addInfoBoxText("Capital: Charleston");
      g_map_stateMap["WI"].addInfoBoxText("Capital: Madison");
      g_map_stateMap["WY"].addInfoBoxText("Capital: Cheyenne");


      //
      // Put some additional text into the info box. This example demonstrates 
      // how the addInfoBoxText() method automatically wraps the text according
      // to the size of the string you give it.
      //

      for ( var abbrev in g_map_stateMap )
      {
         var state = g_map_stateMap[abbrev]; 
         state.addInfoBoxText("");
         //state.addInfoBoxText("");
         //state.addInfoBoxText("Put stuff here");
      }

      
      return;
}
