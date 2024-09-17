from flask import Flask, render_template, request, jsonify
import dronekit
from dronekit import connect, VehicleMode, LocationGlobalRelative
import dronekit_sitl
import time
import argparse
import codecs
import os
import sys
import threading

import serial
from serial.tools.list_ports import comports
from serial.tools import hexlify_codec

app2 = Flask(__name__)
drones = []
n=0
nod=[]
ddn=[]
nf=[]
location=[]
ports = []

# for ports connected
def ask_for_port():
    sys.stderr.write('\n--- Available ports:\n')
    
    for n, (port, desc, hwid) in enumerate(sorted(comports()), 1):
        sys.stderr.write('--- {:2}: {}\n'.format(n, port))
        print(type(port))
        ports.append(port)

# Define a function to establish a connection to the drone
def connect_to_drone():
    # kk=dc
    # comm=['COM1','COM2','COM3','COM4','COM5','COM6']
    
       
    ask_for_port()
    if(len(ports)==0):
       print("no ports connected")
       return 0
    else:
      for dc in ports:
        drone=connect(dc, baud=57600)
        drones.append(drone)
        print(drones)
      return 1

# Define a function to close the connection to the drone
def close_drone_connection():
  # Close the connection to all drones
    k=0
    for drone in drones:
      drone.close()
      k=k+1
    if(k==len(drones)):
      print("Drone disconnected")

# # Define a function to takeoff
def takeoff(i,alt):
#   # Check if the drone is connected
  if not drones:
    return jsonify({"error": "Drone is not connected"})
  print(i)
  while not drones[i].is_armable:
        print(" Waiting for vehicle to initialise...")
        time.sleep(2)
  print("Arming motors")
  drones[i].mode = VehicleMode("GUIDED")
  drones[i].armed=True
  while not drones[i].armed:
    print(" Waiting for arming...")
    time.sleep(3)
    print(drones[i],i)
    drones[i].airspeed = 5
    
    drones[i].simple_takeoff(alt)

    while drones[i].armed==True:
        print(" Altitude of drone ",i,"is:", drones[i].location.global_relative_frame.alt)
        if drones[i].location.global_relative_frame.alt >= (alt)*0.95:
            print("Reached target altitude drone:",i)
            break
        time.sleep(3)  

  # Return a success message
  return "Drone has taken off"

# # Define a function to location
def dpos():
  for i in range(0,nf[0]):
    for j in range(0,len(drones)):
    # for i in range(len(drones)*j,len(drones)*(j+1)):
      if(drones[j].armed==True):
          drones[j].simple_goto(location[(len(drones)*i)+j])
          print("Start")
          time.sleep(10)

# # Define a function to land
def land():
  # Check if the drone is connected
  if not drones:
    return jsonify({"error": "Drone is not connected"})

  # Set the drone mode to RTL
  for i in range(len(drones)):
    drones[i].mode = VehicleMode("RTL")
  time.sleep(20)
  for i in range(len(drones)):
    if drones[len(drones)-1].location.global_relative_frame.alt == 0:
        return "Drone has landed"
    else:
        return "error"
    
#function for led displaying a letter
def ledld(letter):
   ll=[]
   k=0
   for p in range(len(letter)):
      ll.append(letter[p])
   switch=[
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
   t=0;
   for d in range(len(drones)):
    for j in range(t,len(ll)):
      for i in range(0,len(switch)):
            if(ll[j]==switch[i]):
                k=i
                break
            # break

      print(d," ",ll[j])
      # print()
      drones[d].channels.overrides={'6':800+((k+1)*52)}
      t=j+1
      break
    
    

@app2.route('/')
def index():
  # Render the index template with the drone status
  return render_template('drone.html')

@app2.route('/numFormations', methods=['POST'])
def nof():
  # Connect to the drone
  nff=request.form
  
  for key, value in nff.items():
    print(value)
    
    nf.append(int(value))

  # Return a success message
  return "No of Drone formations given"

@app2.route('/connect_to_drone_route', methods=['POST'])
def connect_to_drone_route():
  if request.method == 'POST':
    # Connect to the drone
    print("KKKKKKKKKKKKKKKKKKKKKK")
    flag=0
    num_drones=request.form
    
    for key, value1 in num_drones.items():
      print(int(value1))
      
    # n=(value)
    flag=connect_to_drone()
    if(flag==0):
    # Return a success message
      return "Drone is connected"
    else:
      return "Drone not connected"
  else:
     print("GET")

@app2.route('/land_route', methods=['POST'])
def land_route():
  # Land
  response = land()

  # Return the response
  return response

@app2.route('/goto_pos', methods=['POST'])
def goto_pos():
  # Land
  for j in range(0,len(drones)):
    takeoff(j,15)
  # dpos()

  # Return the response
  return "hello"

@app2.route('/close_drone_connection', methods=['POST'])
def drone_close():
  # Land
  close_drone_connection()

  # Return the response
  return "closed"

# not needed now
@app2.route('/dn', methods=['POST'])
def dn():
   dno=request.form
   for key, value in dno.items():
    print(value)
    ddn.append(int(value))

   return "Drone number given"

@app2.route('/leddisp', methods=['POST'])
def leddisp():
  letter=request.form
  
  for key, value in letter.items():
    print(value)
    
    ledld(value)
   
   
  return "Displayed"

#for confirming location
# @app1.route('/your-backend-url', methods=['POST'])
@app2.route('/confirmlocation', methods=['POST'])
def receive_data():
  # if request.is_json():
    data = request.get_json()
    print(data)
    for item in data:
      # for key, value in item.items():
        # index = value['index']
        lat = item['lat']
        lng = item['lng']
        height = item['height']
        location.append(LocationGlobalRelative(lat,lng,height));
        # print("pppppppppppppppppppppppppppppppp")
        print(location)
        print(f'Index: {index}, Latitude: {lat}, Longitude: {lng}, Height: {height}')

    return "Retreived"
  # else:
  #   return jsonify({'error': 'Invalid JSON'})
    # return "Locations confirmed"

@app2.route('/sc2')
def sc2():
   return render_template('chan.html')

@app2.route('/drone')
def screen1():
    return render_template('drone.html')

if __name__ == '__main__':
    app2.run(debug=True)