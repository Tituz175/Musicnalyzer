# import speech_recognition as sr

# def transcribe_audio(file_path):
#     recognizer = sr.Recognizer()
#     with sr.AudioFile(file_path) as source:
#         audio_data = recognizer.record(source)  # Read the entire audio file
#         try:
#             # Use Google Web Speech API or any other ASR service
#             text = recognizer.recognize_google(audio_data)
#             return text
#         except sr.UnknownValueError:
#             return "Could not understand audio"
#         except sr.RequestError:
#             return "Could not request results from the service"

# text = transcribe_audio("/home/tobi/Documents/software_engineering/nmhu/ssd/Musicnalyzer/backend/output_audio_file.wav")
# print(text)


import whisper

model = whisper.load_model("tiny")
result = model.transcribe("/home/tobi/Downloads/VOCALS.mp3")
print(result["text"])