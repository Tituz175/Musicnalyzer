import librosa
import soundfile as sf

# Load the audio file
audio_path = '/home/tobi/Documents/software_engineering/nmhu/ssd/Musicnalyzer/backend/uploads/Labisi_-_Olodumare_CeeNaija.com_.mp3'
y, sr = librosa.load(audio_path)

# Shift the pitch (e.g., 4 semitones up)
y_shifted = librosa.effects.pitch_shift(y=y, sr=sr, n_steps=-1, bins_per_octave=12)

# Save the modified audio to a new file
output_path = './output_audio_file.wav'
sf.write(output_path, y_shifted, sr)

print("Pitch-shifted audio saved!")


# Estimate the original BPM
# tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
# print(f"Original BPM: {tempo}")

# Target BPM
# target_bpm = 166

# # Calculate the tempo factor
# tempo_factor = round(target_bpm / tempo[0], 1)

# print(tempo_factor)

# Adjust the tempo
# y_stretched = librosa.effects.time_stretch(y=y, rate=1.1)

# Save the modified audio
# output_path = './output_audio_file_bpm_adjusted.wav'
# sf.write(output_path, y_stretched, sr)

# print(f"Adjusted BPM audio saved at {target_bpm} BPM!")


# backend/uploads/Peterson_Okopi_ft_BBO_Emi_Ko_Le_Sai_Sope.mp3