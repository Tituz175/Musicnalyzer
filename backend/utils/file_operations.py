"""
File operations utility module for managing audio files, including saving, moving, and deleting audio files.

This module provides utilities for:
- Validating allowed file types for upload.
- Saving uploaded audio files, including conversion of MP3 files to WAV format.
- Moving separated audio stems (e.g., instrumental and vocal) to designated directories.
- Deleting unwanted files in a directory while preserving specified files.

Dependencies:
    - os: File and directory path operations.
    - shutil: High-level file operations such as moving files.
    - pydub.AudioSegment: Audio file manipulation, particularly for format conversion.
"""

import os
import shutil
from pydub import AudioSegment

def allowed_file(filename):
    """
    Checks if the uploaded file has an allowed extension (.wav or .mp3).

    Parameters:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file extension is allowed, False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'wav', 'mp3'}

def save_song_file(file, folder, filename, extension):
    """
    Saves an uploaded audio file in the specified folder, converting it to WAV if necessary.

    If the uploaded file is an MP3, it will be converted to WAV format.

    Parameters:
        file (FileStorage): The file to be saved.
        folder (str): The directory where the file should be saved.
        filename (str): The name for the saved file.
        extension (str): The file extension (.mp3 or .wav).

    Returns:
        str: The file path where the file is saved.
    """
    file_path = os.path.join(folder, filename)
    if extension == '.mp3':
        audio = AudioSegment.from_mp3(file)
        audio.export(file_path, format="wav")
    else:
        file.save(file_path)
    return file_path

def move_stem_files(dir_name, instrumental, vocal):
    """
    Moves vocal and instrumental audio stem files to a specified directory.

    If the destination files already exist, they will not be overwritten.
    Prints a message if a file already exists in the destination.

    Parameters:
        dir_name (str): The directory to move the files to.
        instrumental (str): The path to the instrumental file.
        vocal (str): The path to the vocal file.

    Returns:
        tuple: Paths to the moved vocal and instrumental files.
    """
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

    vocal_dest = os.path.join(dir_name, os.path.basename(vocal))
    instrumental_dest = os.path.join(dir_name, os.path.basename(instrumental))
    
    # Move vocal file if it doesn't exist at the destination
    if vocal and not os.path.exists(vocal_dest):
        shutil.move(vocal, vocal_dest)
    elif vocal:
        print(f"File {vocal_dest} already exists. Skipping.")

    # Move instrumental file if it doesn't exist at the destination
    if instrumental and not os.path.exists(instrumental_dest):
        shutil.move(instrumental, instrumental_dest)
    elif instrumental:
        print(f"File {instrumental_dest} already exists. Skipping.")

    return vocal_dest, instrumental_dest

def delete_unwanted_files(directory, *args):
    """
    Deletes all files in the specified directory except for the specified files to keep.

    Parameters:
        directory (str): The path to the directory containing files.
        *args: Paths of the files to retain within the directory.

    Returns:
        None
    """
    # Get a set of base filenames to keep
    keep_files = {os.path.basename(file) for file in args}

    for filename in os.listdir(directory):
        # Construct the full file path
        file_path = os.path.join(directory, filename)
        
        # Skip the file you want to keep
        if filename in keep_files:
            continue
        
        # Check if it's a file and delete it
        if os.path.isfile(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
