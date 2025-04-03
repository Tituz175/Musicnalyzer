"""
Lyrics extraction module using Whisper for automatic transcription.

This module provides utilities for:
- Transcribing audio files to text, using Whisper's speech recognition capabilities.
- Formatting extracted text into a readable lyrics format with line breaks.

Dependencies:
    - re: Regular expressions for splitting text by sentence boundaries.
    - whisper: Whisper ASR model for transcription of audio files to text.
    - textwrap: Text formatting to limit line width.

Functions:
    - extract_lyrics: Transcribes an audio file and formats the extracted text into structured lyrics.
"""

import re
import whisper
import textwrap

def extract_lyrics(path):
    """
    Transcribes an audio file to extract lyrics, and formats them with line breaks for readability.

    Loads a pre-trained Whisper model to transcribe the audio and formats the resulting text into lines,
    each limited to 50 characters for a readable output.

    Parameters:
        path (str): The file path of the audio file to transcribe.

    Returns:
        str: Formatted lyrics as a string, with line breaks at appropriate sentence boundaries.
    """
    model = whisper.load_model("turbo")
    result = model.transcribe(path).get('text')
    
    # Split by punctuation (., !, ?) to maintain sentence structure
    sentences = re.split(r'(?<=[.!?]) +', result)

    # Further split each sentence whenever a capital letter appears (excluding the first letter of the sentence)
    formatted_lines = []
    for sentence in sentences:
        lines = re.split(r'(?=[A-Z])', sentence)  # Splits before capital letters
        formatted_lines.extend(lines)

    # Format with line breaks and wrap text to a max width of 50 characters
    formatted_lyrics = "\n".join(textwrap.fill(line.strip(), width=50) for line in formatted_lines if line.strip())

    return formatted_lyrics
