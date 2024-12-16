########################################################################################################
# 
# This demo enables PyMidiBridge communication over the USB MIDI Port.
#
########################################################################################################

from usb_midi import ports
from adafruit_midi import MIDI

from pymidibridge.MidiBridgeWrapper import MidiBridgeWrapper

# Adafruit MIDI
midi = MIDI(
    midi_in = ports[0],
    midi_out = ports[1],
    out_channel = 1,
    in_buf_size = 1000
)

# Pass the MIDI instance to the wrapper, which will now handle all MIDI stuff in your application
wrapper = MidiBridgeWrapper(
    midi = midi,
    temp_file_path = '/.bridge',
    debug = False
)

print("Listening to MIDI bridge messages...")

# Here, the message loop is implemented directly. You will normally have this loop inside your script.
try:
    # Receive MIDI messages. The wrapper will pass the stuff to the MIDI bridge.
    while True:
        midi_message = wrapper.receive()
    
        # ... do something with the message in your application

except Exception as e:
    # In case of errors, we want the bridge to be functional so we can fix the errors via MIDI.
    # Here, we get the error message incl. trace, send it out via MIDI as error message, and initiate
    # a receive loop listening to bridge messages until reboot.
    import traceback
    message = traceback.format_exception(None, e, e.__traceback__)
    wrapper.error(message)
    