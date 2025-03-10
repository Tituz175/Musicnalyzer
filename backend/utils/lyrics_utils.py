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
    lines = re.split(r'(?<=[.!?]) +', result)

    # Format with line breaks
    formatted_lyrics = "\n".join(textwrap.fill(line, width=50) for line in lines)

    return formatted_lyrics
