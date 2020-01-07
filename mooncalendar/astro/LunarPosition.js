"use strict";

Math.toRadians = function(deg)
{
	return deg * (Math.PI/180);
}

function LunarPosition(julianDate)
{
   setDate(julianDate);
   
   var JDE;
   var T;
   var T2; // T squared
   var T3; // cubed
   var T4; // to the fourth
   var L_prime;
   var D;
   var M;
   var M_prime;
   var F;
   var A1;
   var A2; 
   var A3;
   var E;
   var E2;
   var D_2;
   var D_4;
   var M_2;
   var M_prime_2;
   var F_2;
      
   this.setDate = setDate;
   function setDate(julianDate)
   {
      if (julianDate === 'undefined')
         JDE = 1000000;
      else
         JDE = julianDate;
         
      initialize();
   }
   
   this.getDate = getDate;
   function getDate()
   {
      return JDE;
   }
   
   this.getLongitude = getLongitude;
   function getLongitude()
   {
      var sum_l =
         6288774.0      * Math.sin(                M_prime        ) + 
         1274027.0      * Math.sin(D_2           - M_prime        ) + 
          658314.0      * Math.sin(D_2                            ) + 
          213618.0      * Math.sin(                M_prime_2      ) + 
         -185116.0 * E  * Math.sin(      M                        ) + 
         -114332.0      * Math.sin(                            F_2) + 
           58793.0      * Math.sin(D_2           - M_prime_2      ) + 
           57066.0 * E  * Math.sin(D_2 - M       - M_prime        ) + 
           53322.0      * Math.sin(D_2           + M_prime        ) + 
           45758.0 * E  * Math.sin(D_2 - M                        ) + 
          -40923.0 * E  * Math.sin(      M       - M_prime        ) + 
          -34720.0      * Math.sin(D                              ) + 
          -30383.0 * E  * Math.sin(      M       + M_prime        ) + 
           15327.0      * Math.sin(D_2                       - F_2) + 
          -12528.0      * Math.sin(                M_prime   + F_2) + 
           10980.0      * Math.sin(                M_prime   - F_2) + 
           10675.0      * Math.sin(D_4           - M_prime        ) + 
           10034.0      * Math.sin(          3.0 * M_prime        ) + 
            8548.0      * Math.sin(D_4           - M_prime_2      ) + 
           -7888.0 * E  * Math.sin(D_2 + M       - M_prime        ) + 
           -6766.0 * E  * Math.sin(D_2 + M                        ) + 
           -5163.0      * Math.sin(D             - M_prime        ) + 
            4987.0 * E  * Math.sin(D   + M                        ) + 
            4036.0 * E  * Math.sin(D_2 - M       + M_prime        ) + 
            3994.0      * Math.sin(D_2           + M_prime_2      ) + 
            3861.0      * Math.sin(D_4                            ) + 
            3665.0      * Math.sin(D_2      -3.0 * M_prime        ) + 
           -2689.0 * E  * Math.sin(      M       - M_prime_2      ) + 
           -2602.0      * Math.sin(D_2           - M_prime   + F_2) + 
            2390.0 * E  * Math.sin(D_2 - M       - M_prime_2      ) + 
           -2348.0      * Math.sin(D             + M_prime        ) + 
            2236.0 * E2 * Math.sin(D_2 - M_2                      ) + 
            
           -2120.0 * E  * Math.sin(      M       + M_prime_2      ) + 
           -2069.0 * E2 * Math.sin(      M_2                      ) + 
            2048.0 * E2 * Math.sin(D_2 - M_2     - M_prime        ) + 
           -1773.0      * Math.sin(D_2           + M_prime   - F_2) + 
           -1595.0      * Math.sin(D_2                       + F_2) + 
            1215.0 * E  * Math.sin(D_4 - M       - M_prime        ) + 
           -1110.0      * Math.sin(                M_prime_2 + F_2) + 
            -892.0      * Math.sin(3.0 * D       - M_prime        ) + 
            -810.0 * E  * Math.sin(D_2 + M       + M_prime        ) + 
             759.0 * E  * Math.sin(D_4 - M       - M_prime_2      ) + 
            -713.0 * E2 * Math.sin(      M_2     - M_prime        ) + 
            -700.0 * E2 * Math.sin(D_2 + M_2     - M_prime        ) + 
             691.0 * E  * Math.sin(D_2 + M       - M_prime_2      ) + 
             596.0 * E  * Math.sin(D_2 - M                   - F_2) + 
             549.0      * Math.sin(D_4           + M_prime        ) + 
             537.0      * Math.sin(          4.0 * M_prime        ) + 
             520.0 * E  * Math.sin(D_4 - M                        ) + 
            -487.0      * Math.sin(D             - M_prime_2      ) + 
            -399.0 * E  * Math.sin(D_2 + M                   - F_2) + 
            -381.0      * Math.sin(                M_prime_2 - F_2) + 
             351.0 * E  * Math.sin(D   + M       + M_prime        ) + 
            -340.0      * Math.sin(3.0 * D       - M_prime_2      ) + 
             330.0      * Math.sin(D_4     - 3.0 * M_prime        ) + 
             327.0 * E  * Math.sin(D_2 - M       + M_prime_2      ) + 
            -323.0 * E2 * Math.sin(      M_2     + M_prime        ) + 
             299.0 * E  * Math.sin(D   + M       - M_prime        ) + 
             294.0      * Math.sin(D_2     + 3.0 * M_prime        ) +
                          Math.sin(D_2            -M_prime   - F_2); 
                          
      sum_l += 3958.0 * Math.sin(A1) +
               1962.0 * Math.sin(L_prime - F) +
                318.0 * Math.sin(A2);
                
      var lambda = L_prime + Math.toRadians(sum_l / 1000000.0);
      return lambda;
   }
   
   this.getLatitude = getLatitude;
   function getLatitude()
   {
      var sum_b =
         5128122.0      * Math.sin(                          F) +
          280602.0      * Math.sin(             M_prime    + F) +
          277693.0      * Math.sin(             M_prime    - F) +
          173237.0      * Math.sin(D_2                     - F) +
           55413.0      * Math.sin(D_2        - M_prime    + F) +
           46271.0      * Math.sin(D_2        - M_prime    - F) +
           32573.0      * Math.sin(D_2                     + F) +
           17198.0      * Math.sin(             M_prime_2  + F) +
            9266.0      * Math.sin(D_2        + M_prime    - F) +
            8822.0      * Math.sin(             M_prime_2  - F) +
            8216.0 * E  * Math.sin(D_2 - M                 - F) +
            4324.0      * Math.sin(D_2        - M_prime_2  - F) +
            4200.0      * Math.sin(D_2        + M_prime    + F) +
           -3359.0 * E  * Math.sin(D_2 + M                 - F) +
            2463.0 * E  * Math.sin(D_2 - M    - M_prime    + F) +
            2211.0 * E  * Math.sin(D_2 - M                 + F) +
            2065.0 * E  * Math.sin(D_2 - M    - M_prime    - F) +
           -1870.0 * E  * Math.sin(      M    - M_prime    - F) +
            1828.0      * Math.sin(D_4        - M_prime    - F) +
           -1794.0 * E  * Math.sin(      M                 + F) +
           -1749.0      * Math.sin(                   3.0  * F) +
           -1565.0 * E  * Math.sin(      M     - M_prime   + F) +
           -1491.0      * Math.sin(D                       + F) +
           -1475.0 * E  * Math.sin(      M     + M_prime   + F) +
           -1410.0 * E  * Math.sin(      M     + M_prime   - F) +
           -1344.0 * E  * Math.sin(      M                 - F) +
           -1335.0      * Math.sin(D                       - F) +
            1107.0      * Math.sin(       3.0  * M_prime   + F) +
            1021.0      * Math.sin(D_4                     - F) +
             833.0      * Math.sin(D_4         - M_prime   + F) +
             
             777.0      * Math.sin(          M_prime - 3.0 * F) +
             671.0      * Math.sin(D_4         - M_prime_2 + F) +
             607.0      * Math.sin(D_2                -3.0 * F) +
             596.0      * Math.sin(D_2         + M_prime_2 - F) +
             491.0 * E  * Math.sin(D_2 - M     + M_prime   - F) +
            -451.0      * Math.sin(D_2         - M_prime_2 + F) +
             439.0      * Math.sin(        3.0 * M_prime   - F) +
             422.0      * Math.sin(D_2         + M_prime_2 + F) +
             421.0      * Math.sin(D_2    -3.0 * M_prime   - F) +
            -366.0 * E  * Math.sin(D_2 + M     - M_prime   + F) +
            -351.0 * E  * Math.sin(D_2 + M                 + F) +
             331.0      * Math.sin(D_4                     + F) +
             315.0 * E  * Math.sin(D_2 - M     + M_prime   + F) +
             302.0 * E2 * Math.sin(D_2 - M_2               - F) +
            -283.0      * Math.sin(          M_prime + 3.0 * F) +
            -229.0 * E  * Math.sin(D_2 + M     + M_prime   - F) +
             223.0 * E  * Math.sin(D   + M                 - F) +
             223.0 * E  * Math.sin(D   + M                 + F) +
            -220.0 * E  * Math.sin(      M     - M_prime_2 - F) +
            -220.0 * E  * Math.sin(D_2 + M     - M_prime   - F) +
            -185.0      * Math.sin(D           + M_prime   + F) +
             181.0 * E  * Math.sin(D_2 - M     - M_prime_2 - F) +
            -177.0 * E  * Math.sin(      M     + M_prime_2 + F) +
             176.0      * Math.sin(D_4         - M_prime_2 - F) +
             166.0 * E  * Math.sin(D_4 - M     - M_prime   - F) +
            -164.0      * Math.sin(D           + M_prime   - F) +
             132.0      * Math.sin(D_4         + M_prime   - F) +
            -119.0      * Math.sin(D           - M_prime   - F) +
             115.0 * E  * Math.sin(D_4 - M                 - F) +
             107.0 * E2 * Math.sin(D_2 - M_2               + F);
      
      sum_b += -2235.0 * Math.sin(L_prime) +
                 382.0 * Math.sin(A3) +
                 175.0 * Math.sin(A1 - F) +
                 175.0 * Math.sin(A1 + F) +
                 127.0 * Math.sin(L_prime - M_prime) -
                 115.0 * Math.sin(L_prime + M_prime);
                 
      return Math.toRadians(sum_b / 1000000.0);
   }
   
   this.getDistance = getDistance;
   function getDistance()
   {
      var sum_r =
         -20905355.0      * Math.cos(                M_prime        ) + 
          -3699111.0      * Math.cos(D_2           - M_prime        ) + 
          -2955968.0      * Math.cos(D_2                            ) + 
           -569925.0      * Math.cos(                M_prime_2      ) + 
             48888.0 * E  * Math.cos(      M                        ) + 
             -3149.0      * Math.cos(                            F_2) + 
            246158.0      * Math.cos(D_2           - M_prime_2      ) + 
           -152138.0 * E  * Math.cos(D_2 - M       - M_prime        ) + 
           -170733.0      * Math.cos(D_2           + M_prime        ) + 
           -204586.0 * E  * Math.cos(D_2 - M                        ) + 
           -129620.0 * E  * Math.cos(      M       - M_prime        ) + 
            108743.0      * Math.cos(D                              ) + 
            104755.0 * E  * Math.cos(      M       + M_prime        ) + 
             10321.0      * Math.cos(D_2                       - F_2) + 
                            Math.cos(                M_prime   + F_2) + 
             79661.0      * Math.cos(                M_prime   - F_2) + 
            -34782.0      * Math.cos(D_4           - M_prime        ) + 
            -23210.0      * Math.cos(          3.0 * M_prime        ) + 
            -21636.0      * Math.cos(D_4           - M_prime_2      ) + 
             24208.0 * E  * Math.cos(D_2 + M       - M_prime        ) + 
             30824.0 * E  * Math.cos(D_2 + M                        ) + 
             -8379.0      * Math.cos(D             - M_prime        ) + 
            -16675.0 * E  * Math.cos(D   + M                        ) + 
            -12831.0 * E  * Math.cos(D_2 - M       + M_prime        ) + 
            -10445.0      * Math.cos(D_2           + M_prime_2      ) + 
            -11650.0      * Math.cos(D_4                            ) + 
             14403.0      * Math.cos(D_2      -3.0 * M_prime        ) + 
             -7003.0 * E  * Math.cos(      M       - M_prime_2      ) + 
                            Math.cos(D_2           - M_prime   + F_2) + 
             10056.0 * E  * Math.cos(D_2 - M       - M_prime_2      ) + 
              6322.0      * Math.cos(D             + M_prime        ) + 
             -9884.0 * E2 * Math.cos(D_2 - M_2                      ) + 
            
              5751.0 * E  * Math.cos(      M       + M_prime_2      ) + 
                       E2 * Math.cos(      M_2                      ) + 
             -4950.0 * E2 * Math.cos(D_2 - M_2     - M_prime        ) + 
              4130.0      * Math.cos(D_2           + M_prime   - F_2) + 
                            Math.cos(D_2                       + F_2) + 
             -3958.0 * E  * Math.cos(D_4 - M       - M_prime        ) + 
                            Math.cos(                M_prime_2 + F_2) + 
              3258.0      * Math.cos(3.0 * D       - M_prime        ) + 
              2616.0 * E  * Math.cos(D_2 + M       + M_prime        ) + 
             -1897.0 * E  * Math.cos(D_4 - M       - M_prime_2      ) + 
             -2117.0 * E2 * Math.cos(      M_2     - M_prime        ) + 
              2354.0 * E2 * Math.cos(D_2 + M_2     - M_prime        ) + 
                       E  * Math.cos(D_2 + M       - M_prime_2      ) + 
                       E  * Math.cos(D_2 - M                   - F_2) + 
             -1423.0      * Math.cos(D_4           + M_prime        ) + 
             -1117.0      * Math.cos(          4.0 * M_prime        ) + 
             -1571.0 * E  * Math.cos(D_4 - M                        ) + 
             -1739.0      * Math.cos(D             - M_prime_2      ) + 
                       E  * Math.cos(D_2 + M                   - F_2) + 
             -4421.0      * Math.cos(                M_prime_2 - F_2) + 
                       E  * Math.cos(D   + M       + M_prime        ) + 
                            Math.cos(3.0 * D       - M_prime_2      ) + 
                            Math.cos(D_4     - 3.0 * M_prime        ) + 
                       E  * Math.cos(D_2 - M       + M_prime_2      ) + 
              1165.0 * E2 * Math.cos(      M_2     + M_prime        ) + 
                       E  * Math.cos(D   + M       - M_prime        ) + 
                            Math.cos(D_2     + 3.0 * M_prime        ) +
              8752.0      * Math.cos(D_2            -M_prime   - F_2);
              
      return (385000.56 + sum_r / 1000.0);  
   }
   
   function initialize()
   {
      T = (JDE - 2451545.0) / 36525.0;
      //document.write("T: " + T + "<br />"); 
      
      T2 = T * T;
      T3 = T2 * T;
      T4 = T3 * T;
      
      L_prime = 218.3164477 + 481267.88123421 * T
                            - 0.0015786 * T2
                            + T3 / 538841.0
                            - T4 / 65194000.0;
      //document.write("L_prime: " + redux(L_prime) + "<br />");                      
      
      D = 297.8501921 + 445267.1114034 * T
                      - 0.0018819 * T2
                      + T3 / 545868.0
                      - T4 / 113065000.0;
      //document.write("D: " + D + "<br />");        
                      
      M = 357.5291092 + 35999.0502909 * T
                      - 0.0001536 * T2
                      + T3 / 24490000.0;
      //document.write("M: " + M + "<br />");        
                      
      M_prime = 134.9633964 + 477198.8675055 * T
                            + 0.0087414 * T2
                            + T3 / 69699.0
                            - T4 / 14712000.0;
      //document.write("M_prime: " + M_prime + "<br />");        
                            
      F = 93.2720950 + 483202.0175233 * T
                     - 0.0036539 * T2
                     - T3 / 3525000.0
                     + T4 / 863310000.0;
      //document.write("F: " + F + "<br />");                              
      
      A1 = 119.75 + 131.849 * T;
      A2 = 53.09 + 479264.290 * T;
      A3 = 313.45 + 481266.484 * T;
      
      E = 1.0 - 0.002516 * T - 0.000074 * T2;
      E2 = E * E;
                                    
      // Convert everything to radians.
      L_prime = Math.toRadians(L_prime);
      D = Math.toRadians(D);
      M = Math.toRadians(M);
      M_prime = Math.toRadians(M_prime);
      F = Math.toRadians(F);
      A1 = Math.toRadians(A1);
      A2 = Math.toRadians(A2);
      A3 = Math.toRadians(A3);
      
      // Precompute some common multiples of the above values.
      D_2 = 2.0 * D;
      D_4 = 4.0 * D;
      M_2 = 2.0 * M;
      M_prime_2 = 2.0 * M_prime;
      F_2 = 2.0 * F;      
   }
   
   this.redux = redux;
   function redux(angle)
   {
      var t = angle - 360.0 * Math.floor(angle / 360.0);
      
      if (t < 0.0)
         t += 360.0;
         
      return t;
   }
}