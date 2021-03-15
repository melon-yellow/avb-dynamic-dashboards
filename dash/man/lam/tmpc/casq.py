
import json
import pandas as pd
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta

def casq():

    obj = json.load(open("inputs.json", "r"))
    params = json.load(open("filter.json", "r"))

    bitolas = dict(fm=list(), rb=list())

    #Fix null data
    if params["data"] == None: params["data"] = 12

    def separate(info):
        df = pd.DataFrame(obj)
        df = df[df["fmrb"] == info]

        #Filtra pela bitola selecionada
        if params["bitola"] != None:
            df = df[df["bitola"] == params["bitola"]]
        get_date_filter = date.today() - relativedelta(months=params["data"])
        date_to_filter = date(get_date_filter.year, get_date_filter.month, (get_date_filter.day - get_date_filter.day) + 1)

        #retira os itens duplicados
        df["t"] = df["t"].astype(str)
        df = df.drop_duplicates(subset="t")

        #Transforma a data do tipo STR para tipo Data
        df["t"] = pd.to_datetime(df["t"], dayfirst=True)

        #Filtra a data do dataframa para o valor de filtro definido pelo usuÃ¡rio
        date_to_filter = pd.Timestamp(date_to_filter)
        df = df[df["t"] >= date_to_filter] 

        #Ordena a lista e formata a data
        df = df.sort_values(by=["t"], ascending=False)
        df["t"] = df["t"].dt.strftime("%d/%m/%Y")
        
        return df.values.tolist()

    bitolas["fm"] = separate("fm")
    bitolas["rb"] = separate("rb")

    return bitolas