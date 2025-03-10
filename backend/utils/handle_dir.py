import os

def delete_files_except_one(directory, *args):
    """
    Deletes all files in the specified directory except for specified files.
    
    :param directory: The path to the directory containing files.
    :param args: Names of the files to keep (full names with extensions).
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