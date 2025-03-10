import os
import re
import madmom
import ffmpeg


def get_bpm(filename):
	tempo_estimator = madmom.features.tempo.TempoEstimationProcessor(fps=100)
	beat_processor = madmom.features.beats.RNNBeatProcessor()(filename)
	estimated_tempo = tempo_estimator(beat_processor)
	tempo = estimated_tempo[0][0]
	return round(tempo)

def change_bpm(current_audio_path, current_bpm, value_bpm):
    try:
        # Construct the regex to match _BPM_ followed by digits
        # Using raw strings to prevent escape issues
        # This regex finds _BPM_ followed by one or more digits
        bpm_pattern = r'(_BPM_)\d+'

        # Replace the BPM part of the path with the new BPM value
        output_path = re.sub(bpm_pattern, r'\g<1>' + str(value_bpm), current_audio_path)

        # Check if the file already exists
        if os.path.exists(output_path):
            print(f"File already exists: {output_path}")
            return output_path
            # Debug: Print the output path to ensure it's correct
        print(f"Modified path: {output_path}")

        # Calculate the tempo change ratio
        tempo_change = round((value_bpm / current_bpm), 4)

        # Use ffmpeg to change the BPM
        ffmpeg.input(current_audio_path).filter('atempo', tempo_change).output(output_path).overwrite_output().run()

        print(f"Modified audio saved as '{output_path}'")

        if "#" in output_path:
            output_path_url = output_path.replace('#', '%23')
            return output_path_url
        
        return output_path
    except Exception as e:
        print(f"Error: {e}")
        # return jsonify({"error": str(e)}), 500
