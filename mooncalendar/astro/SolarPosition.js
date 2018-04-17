"use strict";

function SolarPosition(julianDate)
{
   setDate(julianDate);
   
   var JDE;
   var tau;
   var tau2; // Tau squared
   var tau3; // cubed
   var tau4; // to the fourth
   var tau5; // to the fifth
   
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
      var L0 =
         175347046.0 * Math.cos(0.0       + 0.0 * tau) +
           3341656.0 * Math.cos(4.6692568 +   6283.0758500 * tau) +
             34894.0 * Math.cos(4.62610   +  12566.15170 * tau) +
              3497.0 * Math.cos(2.7441    +   5753.3849 * tau) +
              3418.0 * Math.cos(2.8289    +      3.5231 * tau) +
              3136.0 * Math.cos(3.6277    +  77713.7715 * tau) +
              2676.0 * Math.cos(4.4181    +   7860.4194 * tau) +
              2343.0 * Math.cos(6.1352    +   3930.2097 * tau) +
              1324.0 * Math.cos(0.7425    +  11506.7698 * tau) +
              1273.0 * Math.cos(2.0371    +    529.6910 * tau) +
              1199.0 * Math.cos(1.1096    +   1577.3435 * tau) +
               990.0 * Math.cos(5.233     +   5884.927 * tau) +
               902.0 * Math.cos(2.045     +     26.298 * tau) +
               857.0 * Math.cos(3.508     +    398.149 * tau) +
               780.0 * Math.cos(1.179     +   5223.694 * tau) +
               753.0 * Math.cos(2.533     +   5507.553 * tau) +
               505.0 * Math.cos(4.583     +  18849.228 * tau) +
               492.0 * Math.cos(4.205     +    775.523 * tau) +
               357.0 * Math.cos(2.920     +      0.067 * tau) +
               317.0 * Math.cos(5.849     +  11790.629 * tau) +
               284.0 * Math.cos(1.899     +    796.298 * tau) +
               271.0 * Math.cos(0.315     +  10977.079 * tau) +
               243.0 * Math.cos(0.345     +   5486.778 * tau) +
               206.0 * Math.cos(4.806     +   2544.314 * tau) +
               205.0 * Math.cos(1.869     +   5573.143 * tau) +
               202.0 * Math.cos(2.458     +   6069.777 * tau) +
               156.0 * Math.cos(0.833     +    213.299 * tau) +
               132.0 * Math.cos(3.411     +   2942.463 * tau) +
               126.0 * Math.cos(1.083     +     20.775 * tau) +
               115.0 * Math.cos(0.645     +      0.980 * tau) +
               103.0 * Math.cos(0.636     +   4694.003 * tau) +
               102.0 * Math.cos(0.976     +  15720.839 * tau) +
               102.0 * Math.cos(4.267     +      7.114 * tau) +
                99.0 * Math.cos(6.21      +   2146.17 * tau) +
                98.0 * Math.cos(0.68      +    155.42 * tau) +
                86.0 * Math.cos(5.98      + 161000.69 * tau) +
                85.0 * Math.cos(1.30      +   6275.96 * tau) +
                85.0 * Math.cos(3.67      +  71430.70 * tau) +
                80.0 * Math.cos(1.81      +  17260.15 * tau) +
                79.0 * Math.cos(3.04      +  12036.46 * tau) +
                75.0 * Math.cos(1.76      +   5088.63 * tau) +
                74.0 * Math.cos(3.50      +   3154.69 * tau) +
                74.0 * Math.cos(4.68      +    801.82 * tau) +
                70.0 * Math.cos(0.83      +   9437.76 * tau) +
                62.0 * Math.cos(3.98      +   8827.39 * tau) +
                61.0 * Math.cos(1.82      +   7084.90 * tau) +
                57.0 * Math.cos(2.78      +   6286.60 * tau) +
                56.0 * Math.cos(4.39      +  14143.50 * tau) +
                56.0 * Math.cos(3.47      +   6279.55 * tau) +
                52.0 * Math.cos(0.19      +  12139.55 * tau) +
                52.0 * Math.cos(1.33      +   1748.02 * tau) +
                51.0 * Math.cos(0.28      +   5856.48 * tau) +
                49.0 * Math.cos(0.49      +   1194.45 * tau) +
                41.0 * Math.cos(5.37      +   8429.24 * tau) +
                41.0 * Math.cos(2.40      +  19651.05 * tau) +
                39.0 * Math.cos(6.17      +  10447.39 * tau) +
                37.0 * Math.cos(6.04      +  10213.29 * tau) +
                37.0 * Math.cos(2.57      +   1059.38 * tau) +
                36.0 * Math.cos(1.71      +   2352.87 * tau) +
                36.0 * Math.cos(1.78      +   6812.77 * tau) +
                33.0 * Math.cos(0.59      +  17789.85 * tau) +
                30.0 * Math.cos(0.44      +  83996.85 * tau) +
                30.0 * Math.cos(2.74      +   1349.87 * tau) +
                25.0 * Math.cos(3.16      +   4690.48 * tau);
      
      var L1 =
         628331966747.0 * Math.cos(0.0      +     0.0 * tau) +
               206059.0 * Math.cos(2.678235 +  6283.075850 * tau) +
                 4303.0 * Math.cos(2.6351   + 12566.1517 * tau) +
                  425.0 * Math.cos(1.590    +     3.523 * tau) +
                  119.0 * Math.cos(5.796    +    26.298 * tau) +
                  109.0 * Math.cos(2.966    +  1577.344 * tau) +
                   93.0 * Math.cos(2.59     + 18849.23 * tau) +
                   72.0 * Math.cos(1.14     +   529.29 * tau) +
                   68.0 * Math.cos(1.87     +   398.15 * tau) +
                   67.0 * Math.cos(4.41     +  5507.55 * tau) +
                   59.0 * Math.cos(2.89     +  5223.69 * tau) +
                   56.0 * Math.cos(2.17     +   155.42 * tau) +
                   45.0 * Math.cos(0.40     +   796.30 * tau) +
                   36.0 * Math.cos(0.47     +   775.52 * tau) +
                   29.0 * Math.cos(2.65     +     7.11 * tau) +
                   21.0 * Math.cos(5.34     +     0.98 * tau) +
                   19.0 * Math.cos(1.85     +  5486.78 * tau) +
                   19.0 * Math.cos(4.97     +   213.30 * tau) +
                   17.0 * Math.cos(2.99     +  6275.96 * tau) +
                   16.0 * Math.cos(0.03     +  2544.31 * tau) +
                   16.0 * Math.cos(1.43     +  2146.17 * tau) +
                   15.0 * Math.cos(1.21     + 10977.08 * tau) +
                   12.0 * Math.cos(2.83     +  1748.02 * tau) +
                   12.0 * Math.cos(3.26     +  5088.63 * tau) +
                   12.0 * Math.cos(5.27     +  1194.45 * tau) +
                   12.0 * Math.cos(2.08     +  4694.00 * tau) +
                   11.0 * Math.cos(0.77     +   553.57 * tau) +
                   10.0 * Math.cos(1.30     +  6286.60 * tau) +
                   10.0 * Math.cos(4.24     +  1349.87 * tau) +
                    9.0 * Math.cos(2.70     +   242.73 * tau) +
                    9.0 * Math.cos(5.64     +   951.72 * tau) +
                    8.0 * Math.cos(5.30     +  2352.87 * tau) +
                    6.0 * Math.cos(2.65     +  9437.76 * tau) +
                    6.0 * Math.cos(4.67     +  4690.48 * tau);
                    
      var L2 =
         52919.0 * Math.cos(0.0    +     0.0 * tau) +
          8720.0 * Math.cos(1.0721 +  6283.0758 * tau) +
           309.0 * Math.cos(0.867  + 12566.152 * tau) +
            27.0 * Math.cos(0.05   +     3.52 * tau) +
            16.0 * Math.cos(5.19   +    26.30 * tau) +
            16.0 * Math.cos(3.68   +   155.42 * tau) +
            10.0 * Math.cos(0.76   + 18849.23 * tau) +
             9.0 * Math.cos(2.06   + 77713.77 * tau) +
             7.0 * Math.cos(0.83   +   775.52 * tau) +
             5.0 * Math.cos(4.66   +  1577.34 * tau) +
             4.0 * Math.cos(1.03   +     7.11 * tau) +
             4.0 * Math.cos(3.44   +  5573.14 * tau) +
             3.0 * Math.cos(5.14   +   796.30 * tau) +
             3.0 * Math.cos(6.05   +  5507.55 * tau) +
             3.0 * Math.cos(1.19   +   242.73 * tau) +
             3.0 * Math.cos(6.12   +   529.69 * tau) +
             3.0 * Math.cos(0.31   +   398.15 * tau) +
             3.0 * Math.cos(2.28   +   553.57 * tau) +
             2.0 * Math.cos(4.38   +  5223.69 * tau) +
             2.0 * Math.cos(3.75   +     0.98 * tau);
      
      var L3 =
         289.0 * Math.cos(5.844 +  6283.076 * tau) +
          35.0 * Math.cos(0.0   +     0.0 * tau) +
          17.0 * Math.cos(5.49  + 12566.15 * tau) +
           3.0 * Math.cos(5.20  +   155.42 * tau) +
                 Math.cos(4.72  +     3.52 * tau) +
                 Math.cos(5.30  + 18849.23 * tau) +
                 Math.cos(5.97  +   242.73 * tau);
                 
      var L4 =
         114.0 * Math.cos(3.142                 ) +
           8.0 * Math.cos(4.13  +  6283.08 * tau) +
                 Math.cos(3.84  + 12566.15 * tau);
           
      var L5 = Math.cos(3.14);     
                
      return Math.PI + (L0 +
                        L1 * tau +
                        L2 * tau2 +
                        L3 * tau3 +
                        L4 * tau4 +
                        L5 * tau5) / 100000000.0;   
   }
   
   this.getLatitude = getLatitude;
   function getLatitude()
   {
      var B0 =
         280.0 * Math.cos(3.199 + 84334.662 * tau) +
         102.0 * Math.cos(5.422 +  5507.553 * tau) +
          80.0 * Math.cos(3.88  +  5223.69  * tau) +
          44.0 * Math.cos(3.70  +  2352.87  * tau) +
          32.0 * Math.cos(4.00  +  1577.34  * tau);
          
      var B1 =
         9.0 * Math.cos(3.90 + 5507.55 * tau) +
         6.0 * Math.cos(1.73 + 5223.69 * tau);
      
      // Return the negative of the result; the calculations
      // are for the earth, and we adjust to switch it to 
      // the sun.  
      return -(B0 + B1 * tau) / 100000000.0;   
   }
   
   this.getDistance = getDistance;
   function getDistance()
   {
      var R0 =
         100013989.0 * Math.cos(0.0       +      0.0 * tau) +
           1670700.0 * Math.cos(3.0984635 +   6283.0758500 * tau) +
             13956.0 * Math.cos(3.05525   +  12566.15170 * tau) +
              3084.0 * Math.cos(5.1985    +  77713.7715 * tau) +
              1628.0 * Math.cos(1.1739    +   5753.3849 * tau) +
              1576.0 * Math.cos(2.8469    +   7860.4194 * tau) +
               925.0 * Math.cos(5.453     +  11506.770 * tau) +
               542.0 * Math.cos(4.564     +   3930.210 * tau) +
               472.0 * Math.cos(3.661     +   5884.927 * tau) +
               346.0 * Math.cos(0.964     +   5507.553 * tau) +
               329.0 * Math.cos(5.900     +   5223.694 * tau) +
               307.0 * Math.cos(0.299     +   5573.143 * tau) +
               243.0 * Math.cos(4.273     +  11790.629 * tau) +
               212.0 * Math.cos(5.847     +   1577.344 * tau) +
               186.0 * Math.cos(5.022     +  10977.079 * tau) +
               175.0 * Math.cos(3.012     +  18849.228 * tau) +
               110.0 * Math.cos(5.055     +   5486.778 * tau) +
                98.0 * Math.cos(0.89      +   6069.78 * tau) +
                86.0 * Math.cos(5.69      +  15720.84 * tau) +
                86.0 * Math.cos(1.27      + 161000.69 * tau) +
                65.0 * Math.cos(0.27      +  17260.15 * tau) +
                63.0 * Math.cos(0.92      +    529.69 * tau) +
                57.0 * Math.cos(2.01      +  83996.85 * tau) +
                56.0 * Math.cos(5.24      +  71430.70 * tau) +
                49.0 * Math.cos(3.25      +   2544.31 * tau) +
                47.0 * Math.cos(2.58      +    775.52 * tau) +
                45.0 * Math.cos(5.54      +   9437.76 * tau) +
                43.0 * Math.cos(6.01      +   6275.96 * tau) +
                39.0 * Math.cos(5.36      +   4694.00 * tau) +
                38.0 * Math.cos(2.39      +   8827.39 * tau) +
                37.0 * Math.cos(0.83      +  19651.05 * tau) +
                37.0 * Math.cos(4.90      +  12139.55 * tau) +
                36.0 * Math.cos(1.67      +  12036.46 * tau) +
                35.0 * Math.cos(1.84      +   2942.46 * tau) +
                33.0 * Math.cos(0.24      +   7084.90 * tau) +
                32.0 * Math.cos(0.18      +   5088.63 * tau) +
                32.0 + Math.cos(1.78      +    398.15 * tau) +
                28.0 * Math.cos(1.21      +   6286.60 * tau) +
                28.0 * Math.cos(1.90      +   6279.55 * tau) +
                26.0 * Math.cos(4.59      +  10447.39 * tau);
                
      var R1 =
         103019.0 * Math.cos(1.107490 +  6283.075850 * tau) +
           1721.0 * Math.cos(1.0644   + 12566.1517 * tau) +
            702.0 * Math.cos(3.142                    ) +
             32.0 * Math.cos(1.02     + 18849.23 * tau) +
             31.0 * Math.cos(2.84     +  5507.55 * tau) +
             25.0 * Math.cos(1.32     +  5223.69 * tau) +
             18.0 * Math.cos(1.42     +  1577.34 * tau) +
             10.0 * Math.cos(5.91     + 10977.08 * tau) +
              9.0 * Math.cos(1.42     +  6275.96 * tau) +
              9.0 * Math.cos(0.27     +  5486.78 * tau);
              
      var R2 =
         4359.0 * Math.cos(5.7846 +  6283.0758 * tau) +
          124.0 * Math.cos(5.579  + 12566.152 * tau) +
           12.0 * Math.cos(3.14                   ) +
            9.0 * Math.cos(3.63   + 77713.77 * tau) +
            6.0 * Math.cos(1.87   +  5573.14 * tau) +
            3.0 * Math.cos(5.47   + 18849.23 * tau);
            
      var R3 =
         145.0 * Math.cos(4.273 +  6283.076 * tau) +
           7.0 * Math.cos(3.92  + 12566.15 * tau);
           
      var R4 =
         4.0 * Math.cos(2.56 + 6283.08 * tau);
      
      return ((R0 +
               R1 * tau +
               R2 * tau2 +
               R3 * tau3 +
               R4 * tau4) / 100000000.0) * 149597870.691;   
   }
   
   function initialize()
   {
      tau = (JDE - 2451545.0) / 365250.0;
      
      tau2 = tau * tau;
      tau3 = tau2 * tau;
      tau4 = tau3 * tau;
      tau5 = tau4 * tau;
   }
}