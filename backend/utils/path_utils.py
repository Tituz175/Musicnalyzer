"""
Audio file path manipulation module for updating musical metadata in file paths.

This module provides utilities for:
- Updating the musical key or BPM information in audio file paths.
- Normalizing and cleaning audio file paths to ensure correct directory structures.
- Encoding special characters in file paths, particularly for web-safe URLs.

Dependencies:
    - os: File path operations and normalization.
    - re: Regular expressions for finding and replacing metadata patterns in paths.

Functions:
    - update_key_in_path: Updates the key metadata in an audio file path with a new key value.
    - update_bpm_in_path: Updates the BPM metadata in an audio file path with a new BPM value.
    - clean_audio_paths: Cleans and normalizes a dictionary of audio paths.
    - encode_special_chars: Encodes special characters (e.g., '#') in file paths.
"""

import os
import re

def update_key_in_path(current_audio_path, new_key):
    """
    Updates the musical key in the specified audio file path.

    Replaces the existing key in the path with a new key value, and returns both a 
    standard and URL-encoded version of the updated path.

    Parameters:
        current_audio_path (str): The current path of the audio file.
        new_key (str): The new musical key (e.g., 'C#m') to update in the path.

    Returns:
        tuple: A tuple containing:
            - str: Updated file path with the new key.
            - str: URL-encoded file path with the new key.
    """
    new_key_url = encode_special_chars(new_key)
    current_audio_path = current_audio_path.replace('%23', '#') if '%23' in current_audio_path else current_audio_path
    output_path = re.sub(r'(_KEY_)[A-G][#]?[m]?', r'\1' + new_key, current_audio_path)
    output_path_url = re.sub(r'(_KEY_)[A-G][#]?[m]?', r'\1' + new_key_url, output_path)
    return os.path.normpath(output_path), output_path_url

def update_bpm_in_path(current_audio_path, new_bpm):
    """
    Updates the BPM value in the specified audio file path.

    Replaces the existing BPM in the path with a new BPM value.

    Parameters:
        current_audio_path (str): The current path of the audio file.
        new_bpm (int): The new BPM value to update in the path.

    Returns:
        tuple: A tuple containing:
            - str: Original file path.
            - str: Updated file path with the new BPM value.
    """
    current_audio_path = current_audio_path.replace('%23', '#') if '%23' in current_audio_path else current_audio_path
    output_path = re.sub(r'(_BPM_)\d+', r'\g<1>' + str(new_bpm), current_audio_path)
    return current_audio_path, os.path.normpath(output_path)

def clean_audio_paths(audio_stem):
    """
    Normalizes and cleans a dictionary of audio paths, removing redundant path segments.

    Parameters:
        audio_stem (dict): Dictionary of audio paths with keys as identifiers and values as file paths.

    Returns:
        dict: Cleaned and normalized audio paths.
    """
    return {key: os.path.normpath(value).split('5000')[-1].replace('%2F', '/').lstrip('/\\') 
            for key, value in audio_stem.items() if value}

def encode_special_chars(path):
    """
    Encodes special characters in a file path to ensure compatibility with web-safe URLs.

    Parameters:
        path (str): The file path to encode.

    Returns:
        str: The file path with special characters encoded.
    """
    return path.replace('#', '%23') if "#" in path else path
