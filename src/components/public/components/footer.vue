<template>
    <div class="v-footer">
            <v-bottom-sheet v-model="sheet">
                <template v-slot:activator="{ on }">
                    <v-btn class="ma-2 footer-btn-menu" color="red" dark v-on="on">
                        <v-icon dark>mdi-chevron-up</v-icon>
                    </v-btn>
                </template>
                <v-sheet dark class="px-3 footer-sub-menu" height="200px">
                    <v-btn class="mt-6 footer-btn-menu" dark color="red" @click="sheet = !sheet"><v-icon>mdi-chevron-down</v-icon></v-btn>
                    <v-btn v-if="this.menu != 'Main'" class="mt-6 ml-3" dark color="red" @click="define_menu('Main')"><v-icon>mdi-chevron-left</v-icon></v-btn>
                    <div v-if="this.menu =='Main'">
                        <b-row>
                            <b-col>
                                <v-btn class="mr-2 mb-2" @click="define_menu('Dashboard')"><v-icon>mdi-speedometer-slow</v-icon> Dashboards</v-btn>
                                <v-btn class="mr-2 mb-2" @click="define_menu('Graphs')"><v-icon>mdi-chart-line</v-icon> Graphs</v-btn>
                                <v-btn class="mr-2 mb-2" @click="send_to()"><v-icon>mdi-racing-helmet</v-icon> Race</v-btn>
                                <v-btn class="mr-2 mb-2" @click="send_to('g-force-gforce')"><v-icon>mdi-rotate-orbit</v-icon> G-force</v-btn>
                                <v-btn class="mr-2 mb-2" @click="send_to('track-list')"><v-icon>mdi-go-kart-track</v-icon> Track</v-btn>
                                <v-btn class="mr-2 mb-2" @click="define_menu('Config')"><v-icon>mdi-settings-outline</v-icon> Setting</v-btn>
                            </b-col>
                        </b-row>
                    </div>
                    <menu-dashboards v-if="menu == 'Dashboard'" :menu="menu"></menu-dashboards>
                    <menu-graphs v-if="menu == 'Graphs'" :menu="menu"></menu-graphs>
                    <menu-configs v-if="menu == 'Config'" :menu="menu"></menu-configs>
                </v-sheet>
            </v-bottom-sheet>
            <v-spacer></v-spacer>
            <div class="nissboard-logo">
                <img src="/image/nissboard-logo.svg" style="width: 150px" /> <b>v 0.9.2</b>
            </div>
            <div class="text-right">
                <v-icon :class="[icons.analog.color, 'mx-1']">mdi-current-ac</v-icon>
                <v-icon :class="[icons.ecu.color, 'mx-1']">mdi-chip</v-icon>
                <v-icon :class="[icons.gps.color, 'mx-1']">mdi-satellite-variant</v-icon>
                <v-icon :class="[icons.internet.color, 'mx-1']">{{icons.internet.icon}}</v-icon>
            </div>
        </div>
</template>
<script>
import MenuDashboard from "./menus/dashboards";
import MenuConfig from "./menus/configs";
import GraphConfig from "./menus/graphs";

export default {
    name: "Footer",
    data(){
        return{
            menu: "Main",
            sheet: false,
            icons: { ecu: {color: "text-color-warning"}, gps: {color: "text-color-warning"}, analog: {color: "text-color-warning"}, internet: {color: "text-color-warning", icon: "mdi-wifi-strength-outline"}},
            ecu_connection: {status: false},
            internet_connection: {status: false},
            gps_connection: {status: false},
            analog_connection: {status: false},
        }
    },
    components:{
        'menu-dashboards': MenuDashboard,
        'menu-configs': MenuConfig,
        'menu-graphs': GraphConfig
    },
    mounted(){
        this.connections()
    },
    methods:{
        send_to(name){
            this.sheet = false
            this.$router.push({ name: name, params: {}});
        },
        define_menu(menu){
            this.menu = menu;
        },
        connections(){
            this.sockets.subscribe('ecuConnection', (data) => {
                this.ecu_connection = data;
            })
            this.sockets.subscribe('InternetConnection', (data) => {
                this.internet_connection = data;
            })
            this.sockets.subscribe('gpsConnection', (data) => {
                this.gps_connection = data;
            })
            this.sockets.subscribe('analogConnection', (data) => {
                this.analog_connection = data;
            })
        }

    },
    watch:{
        "ecu_connection": {
            handler: function() {
                if (this.ecu_connection.status){
                    this.icons.ecu.color =  "text-color-success"
                }else{
                    this.icons.ecu.color =  "text-color-warning"
                }
            }
        },
        "internet_connection": {
            handler: function() {
                if (this.internet_connection.status){
                    this.icons.internet.icon = "mdi-wifi"
                    this.icons.internet.color =  "text-color-success"
                }else{
                    this.icons.internet.icon = "mdi-wifi-strength-outline"
                    this.icons.internet.color =  "text-color-warning"
                }
            }
        },
        "analog_connection": {
            handler: function() {
                if (this.analog_connection.status){
                    this.icons.analog.color =  "text-color-success"
                }else{
                    this.icons.analog.color =  "text-color-warning"
                }
            }
        },
        "gps_connection": {
            handler: function() {
                if (this.gps_connection.status){
                    if(this.gps_connection.signal){
                        this.icons.gps.color =  "text-color-success"
                    }else{
                        this.icons.gps.color =  "text-color-warning"
                    }                 
                }else{
                    this.icons.gps.icon = "mdi-wifi-strength-outline"
                    this.icons.gps.color =  "text-color-danger"
                }
            }
        },
    }
}
</script>
<style scoped>
.text-color-warning{
    color: rgba(255, 255, 0, 0.753);
}
.text-color-success{
    color: rgb(0, 170, 0);
}
.text-color-danger{
    color: rgb(243, 32, 19);
}
.min-letter {
  font-size: 15px;
}
.v-footer{
    background-color: transparent !important;
}
.footer-btn-icon{
    font-size: 40px;
}
.v-footer{
    position: fixed;
    width: 100%;
    bottom: 0px;
    z-index: 10;
}
.v-footer .footer-btn-menu{
    position: absolute;
    left: 0;
    margin-left: 0px !important;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    padding: 30px;
    border-top-right-radius: 42px;  
    z-index: 9999;
}
.v-footer .footer-btn-menu i, .footer-sub-menu .footer-btn-menu i{
    font-size: 40px;
}
.footer-sub-menu .footer-btn-menu{
    position: absolute;
    margin-top: -60px !important;
    left: 0;
    margin-left: 0px !important;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    padding: 30px;
    border-top-right-radius: 42px;
}
.nissboard-logo{
	position: absolute;
	bottom: 10px;
	width: 100%;
    text-align: center;
}
</style>