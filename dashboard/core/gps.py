import pynmea2
from core.serial import PortSerial

class Gps():

	def __init__(self, socketio, gps_path, serial_class):
		self.socketio = socketio
		self.port_serial = PortSerial(gps_path, serial_class)
		self.PORT = None

	def start(self):
		while self.port_serial.set_port(): 
			print("No GPS Devise connected in "+self.gps_path)
			self.socketio.emit('gps_conection', {'status': False})
		self.PORT = self.port_serial.PORT
		while True:
			self.parse_gps()

	def parse_gps(self):
		gps = self.PORT.readline().decode()
		if gps.find('GGA') > 0:
			msg = pynmea2.parse(gps)
			self.socketio.emit("gps", {"lat": msg.lat, "lat_dir": msg.lat_dir, "lon": msg.lon, "lon_dir": msg.lon_dir, "altitude": msg.altitude, "altitude_long": msg.altitude_units, "sat_numbers": msg.num_sats})
			print ("Timestamp: %s -- Lat: %s %s -- Lon: %s %s -- Altitude: %s %s -- Satellites: %s" % (msg.timestamp,msg.lat,msg.lat_dir,msg.lon,msg.lon_dir,msg.altitude,msg.altitude_units,msg.num_sats))
