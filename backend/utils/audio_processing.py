"""
Audio processing module for analyzing songs, separating stems, and generating vocal parts.

This module provides functionality to:
- Load and analyze audio files for musical attributes like key and BPM.
- Separate audio into vocal and instrumental stems.
- Generate additional vocal parts (e.g., Alto, Tenor) based on an existing part.
- Process and rename audio files based on analysis results.

Dependencies:
    - os: Interacting with the file system.
    - re: Regular expression operations for file name cleaning.
    - librosa: Audio analysis and manipulation.
    - soundfile (sf): Audio file I/O.
    - audio_separator.Separator: External module for stem separation.
    - file_operations.move_stem_files: Helper function to move separated files.
    - key_bpm_utils.get_key, get_bpm: Helper functions for key and BPM calculation.
    - path_utils.update_key_in_path, update_bpm_in_path: Helpers for updating file paths based on key and BPM.
"""

import os
import re
import librosa
import soundfile as sf
from audio_separator.separator import Separator
from .file_operations import move_stem_files  # Import only needed functions
from .key_bpm_utils import get_key, get_bpm
from .path_utils import update_key_in_path, update_bpm_in_path  # Use path helpers for consistency

def load_song(source_audio):
    """
    Load an audio file, decoding any encoded characters in the file path.

    Parameters:
        source_audio (str): Path to the audio file.

    Returns:
        tuple: Tuple containing the loaded audio signal (ndarray) and sample rate (int).
    """
    if "%23" in source_audio:
        source_audio = source_audio.replace("%23", "#")  # Replace encoded hash with actual hash symbol
    audio, sample_rate = librosa.load(source_audio)
    return audio, sample_rate

def analyze_song(audio, sample_rate, filename):
    """
    Analyze an audio file to determine its musical key and tempo (BPM).

    Parameters:
        audio (ndarray): The audio signal data.
        sample_rate (int): The sample rate of the audio file.
        filename (str): The name of the audio file (used to help get BPM).

    Returns:
        tuple: A tuple containing the detected key (str) and BPM (float).
    """
    key = get_key(audio, sample_rate)
    bpm = get_bpm(filename)
    return key, bpm

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

def generate_vocal_parts(soprano_path):
    """
    Generate additional vocal parts (Alto and Tenor) based on the Soprano audio file.

    Uses pitch shifting to create harmonized parts, shifting the Soprano down by
    specified intervals to produce the Alto and Tenor parts.

    Parameters:
        soprano_path (str): Path to the Soprano audio file.

    Returns:
        tuple: Paths to the generated Alto and Tenor audio files.
    """
    soprano_audio, sample_rate = load_song(soprano_path)

    alto_path = soprano_path.replace("Soprano", "Alto")
    tenor_path = soprano_path.replace("Soprano", "Tenor")

    alto_audio = librosa.effects.pitch_shift(soprano_audio, sr=sample_rate, n_steps=4)
    tenor_audio = librosa.effects.pitch_shift(soprano_audio, sr=sample_rate, n_steps=-5)

    sf.write(alto_path, alto_audio, sample_rate)
    sf.write(tenor_path, tenor_audio, sample_rate)

    return alto_path, tenor_path

def analyze_and_process_audio(file_path, base_name, folder, is_solo):
    """
    Analyze and process an audio file by determining its key and BPM, extracting stems,
    and optionally generating additional vocal parts if the song is a solo.

    Parameters:
        file_path (str): Path to the original audio file.
        base_name (str): Base name for saving modified files.
        folder (str): Directory to save the processed files.
        is_solo (str): Indicates if the song is a solo ("True") or not.

    Returns:
        tuple: Contains the song's key (str), BPM (float), paths to the generated Soprano,
               Alto, Tenor, and Instrumental stems, and the modified file path URL.
    """
    audio, sample_rate = load_song(file_path)
    key, bpm = analyze_song(audio, sample_rate, file_path)

    modified_filename = f"{base_name}_KEY_{key}_BPM_{bpm}.wav"
    modified_file_path, modified_file_path_url = update_key_in_path(os.path.join(folder, modified_filename), key)
    os.rename(file_path, modified_file_path)

    stem_files = separate_and_rename_stems(modified_file_path)
    soprano_path, instrumental_path = move_stem_files(folder, *stem_files)

    alto_path, tenor_path = ("", "")
    if is_solo == "True":
        alto_path, tenor_path = generate_vocal_parts(soprano_path)

    return key, bpm, soprano_path, alto_path, tenor_path, instrumental_path, modified_file_path_url