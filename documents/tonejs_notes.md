## Tone.js Documentation/Reference for my terminal project

# Start Up

- **`Tone.start()`**: enables the audio, called on user interaction
- **`isAudioInitialized`**: Bool - acts as a barrier to prevent
                      multiple calls to `Tone.start()`

# Making sound

- **`Tone.Synth`**: basic synth sound. composed of **oscillator** and **envelope** which generates sound wave and volume over time respectively
- **Tone.Volume**: utility node for controlling overall volume (in dB)
- **toDestination()**: connects the sound to the user's audio output

# Signals/Connections

- this is describing how the sound moves from a source --> user's output
- **`.connect(destination)`**: the method used to "plug" an audio source node into a destination node
- **Audio Chain**:
    `synth` and `enterSynth` are plugged into audioVolume via .connect
    `audioVolume` is plugged into the user's audio outputa via toDestination()

# Playing sound

- **`triggerAttackRelease(note, duration)`**: a method for playing short sound. **`"D2"`** is the musical note I used and the **`"4n/8n"`** is the duration (literally eigth note and quarter note). Since I have a music background, I prefer to use this over milliseconds.

# Envelope

The evelope is the "shape" of the sound volume over time. There are 4 stages of it:

- **`attack`**: time for sound to reach full volume. The lower the value, the quicker the rate.
- **`decay`**: time for sound to drop from attack level to sustain level.
- **`sustain`**: volume the sound holds at post-decay stage.
- **`release`**: time for sound to go from sustain to silent.
