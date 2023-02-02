from . import filing
import os
from OrcFxAPI import Model

def process_files(filenames):
    filepaths = []
    for filename in filenames:
        name = os.path.basename(filename)
        base, _ = os.path.splitext(name)
        model = Model(filename)
        model.RunSimulation()
        path = os.path.join(filing.SAVE_PATH, f'{base}.{filing.SIM}')
        model.SaveSimulation(path)
        filepaths.append(path)
    return filepaths
    