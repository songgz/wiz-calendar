var EPHEM = {
    earth: (function(){
        return {
            lon: function(t){
                return VSOP87.earth.orbL(t); //XL0_calc(0,0, t,n) //xt星体,zn坐标号,t儒略世纪数,n计算项数
            },

            v: function(t){ //地球速度,t是世纪数,误差小于万分3
                var f=628.307585*t;
                return 628.332 +21 *Math.sin(1.527+f) +0.44 *Math.sin(1.48+f*2)+0.129*Math.sin(5.82+f)*t +0.00055*Math.sin(4.21+f)*t*t;
            },

            lon_t: function(W){ //已知地球真黄经求时间
                var t,v= 628.3319653318;
                t  = ( W - 1.75347          )/v; v=this.v(t);   //v的精度0.03%，详见原文
                t += ( W - this.lon(t,10) )/v; v=this.v(t);   //再算一次v有助于提高精度,不算也可以
                t += ( W - this.lon(t,-1) )/v;
                return t;
            },

            s_aLon:function(t){  //太阳视黄经
                return this.lon(t) + nutationLon2(t) + gxc_sunLon(t) + Math.PI; //注意，这里的章动计算很耗时
            }
        };
    })(),

    moon: (function(){
        return {
            lon: function(t){
                return MPP02.moon.orbL(t);  //  XL1_calc(0,t,n)  //月球经度计算,返回Date分点黄经,传入世纪数,n是项数比例
            },

            v: function(t){ //月球速度计算,传入世经数
                var v = 8399.71 - 914*Math.sin( 0.7848 + 8328.691425*t + 0.0001523*t*t ); //误差小于5%
                v-=179*Math.sin( 2.543  +15542.7543*t )  //误差小于0.3%
                    +160*Math.sin( 0.1874 + 7214.0629*t )
                    +62 *Math.sin( 3.14   +16657.3828*t )
                    +34 *Math.sin( 4.827  +16866.9323*t )
                    +22 *Math.sin( 4.9    +23871.4457*t )
                    +12 *Math.sin( 2.59   +14914.4523*t )
                    +7  *Math.sin( 0.23   + 6585.7609*t )
                    +5  *Math.sin( 0.9    +25195.624 *t )
                    +5  *Math.sin( 2.32   - 7700.3895*t )
                    +5  *Math.sin( 3.88   + 8956.9934*t )
                    +5  *Math.sin( 0.49   + 7771.3771*t );
                return v;
            },

            m_lon_t: function(W){ //已知真月球黄经求时间
                var t,v= 8399.70911033384;
                t  = ( W - 3.81034          )/v;
                t += ( W - this.lon(t,3 ) )/v; v=this.v(t);  //v的精度0.5%，详见原文
                t += ( W - this.lon(t,20) )/v;
                t += ( W - this.lon(t,-1) )/v;
                return t;
            }
        };
    })()



};