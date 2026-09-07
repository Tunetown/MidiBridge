# MidiBridge 0.6.0
- Removed dependency on Adafruit MIDI. The project now works with bytes exclusively in the python implementation. (No changes to the JS implementation)

# MidiBridge 0.5.3
Performance optimizations for python:
- Late importing of bridge and storage providers at time the first message arrives
- Pre-Compiled mpy versions

# MidiBridge 0.5.2
Minor bug fixes:
- Removed warning for syntax errors on save
- Re-Implemented Storage Provider because of reference errors

# MidiBridge 0.5.1
Initial working version.
