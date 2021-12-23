
import json
import pandas as pd
from datetime import datetime, date, timedelta

# Criando view que renderiza troca de Vrings
def vring():

    # Read data.json
    f = open("data_read.json", "r")
    obj = json.load(f)

    # Referência para onde será guardado os valores no laço de repetição
    vrings = dict(
        G19=list(), G20=list(), G21=list(), G22=list(), G23=list(),
        G24=list(), G25=list(), G26=list(), G27=list(), G28=list(),
        PR1=list(), PR2=list(), PR3=list(), PR4=list()
    )

    # Iterate Through STD and IPR Vrings
    for ring in vrings:

        # Get Data
        if ring.startswith("G"): d = obj["{}SUBSTVRING_datatable".format(ring)]["data"]
        elif ring.startswith("PR"): d = obj["{}DPBLOCOVRING_datatable".format(ring)]["data"]
        else: return None

        # Retira Itens duplicados
        df = pd.DataFrame(d)
        df[0] = df[0].astype(str)
        df = df.drop_duplicates(subset=[0])

        # Ordena por datas
        df[0] = pd.to_datetime(df[0], errors="coerce", dayfirst=True)
        df[0] = df[0].dt.strftime("%Y-%m-%d")
        df = df.sort_values(by=[0], ascending=True)
        df[0] = pd.to_datetime(df[0], errors="coerce", dayfirst=True)
        df[0] = df[0].dt.strftime("%d/%m/%Y")

        # Stores data in Vrings
        vrings[ring] = df.values.tolist()

    # Clear Last Element
    for ring in vrings:
        del vrings[ring][-1]

    return vrings