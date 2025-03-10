import os
import re
from audio_separator.separator import Separator

def separate_and_rename_stems(audio_file):
    """
    Separate an audio file into vocal and instrumental stems, renaming them appropriately.

    Uses a pre-trained model to separate the file and then renames the stems
    (e.g., Vocals to Soprano) for standardized use.

    Parameters:
        audio_file (str): Path to the audio file to be separated.

    Returns:
        list: List of paths to the renamed separated stem files.
    """
    separator = Separator()
    separator.load_model()

    output_files = separator.separate(audio_file)
    renamed_files = []

    for file_path in output_files:
        dir_name, file_name = os.path.split(file_path)
        name, ext = os.path.splitext(file_name)

        cleaned_name = re.sub(r"_model_.*", "", name)  # Remove model name
        cleaned_name = re.sub(r"\((Instrumental|Vocals)\)", r"\1", cleaned_name)
        
        if "Vocals" in cleaned_name:
            cleaned_name = cleaned_name.replace("Vocals", "Soprano")

        new_file_path = os.path.join(dir_name, f"{cleaned_name}{ext}")
        os.rename(file_path, new_file_path)
        renamed_files.append(new_file_path)
    
    return renamed_files


audio_file = "/home/tobi/Documents/software_engineering/ssd/Musicnalyzer/backend/uploads/01_Andra_Day_-_Rise_Up.mp3"  # Change this to your actual file path
renamed_files = separate_and_rename_stems(audio_file)

print("Renamed files:", renamed_files)