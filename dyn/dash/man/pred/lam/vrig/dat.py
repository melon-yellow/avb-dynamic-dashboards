
import json
from datetime import datetime, date, timedelta
from vrig import vring

# Parse Data
def parse_data():

    vrings = vring()

    # Get Datas
    datas = []
    for i in vrings["G19"]:
        datas.append(i[0])

    # Função que retorna a data da última troca de Vring
    def daysUsed(lst, tmp):
        list_ = []
        for item in lst:
            if item[2] == 100:
                list_.append(item)
        
        cont = 0 
        confirm = 0 
        for i in list_:
            if i[0] == tmp[0]:
                confirm = 1
                break
            cont += 1

        if confirm == 1:
            # Data da ordem 
            date_current = list_[cont]
            #data da útima troca em relação a datada
            date_last_current = list_[cont-1]
            # Atribuindo valor da data e class date para as variáveis
            date_current = datetime.strptime(date_current[0], "%d/%m/%Y")
            date_last_current = datetime.strptime(date_last_current[0], "%d/%m/%Y")

            days = abs((date_current-date_last_current).days)

            return "{} dias".format(days)
        else:
            return ""
    
    # Função que exibe a data da próxima troca
    def nextChange():
        date_prox = datas[-1]
        date_prox = [int(date_prox[0:2]), int(date_prox[3:5]), int(date_prox[6:10])]
        d = date(date_prox[2], date_prox[1], date_prox[0])
        d = d + timedelta(days=15)
        d = str(d.strftime("%d/%m/%Y"))
        return d

    # Append Data to Json
    def append_dat(key):
        return [
            key,
            "{}".format(daysUsed(vrings[key], vrings[key][-5])),
            "{}".format(daysUsed(vrings[key], vrings[key][-4])),
            "{}".format(daysUsed(vrings[key], vrings[key][-3])),
            "{}".format(daysUsed(vrings[key], vrings[key][-2])),
            "{}".format(daysUsed(vrings[key], vrings[key][-1])),
            ""
        ]

    # Data Json
    data = {
        "SUBSTVRING_datatable": {
            "name": "SUBST. VRING DATATABLE",
            "type": "datatable",
            "data": [
                [
                    "GAIOLA - IPR",
                    "{}".format(datas[-5]),
                    "{}".format(datas[-4]),
                    "{}".format(datas[-3]),
                    "{}".format(datas[-2]),
                    "{}".format(datas[-1]),
                    "Data próxima troca: {}".format(nextChange()),
                    "LEGENDA"
                ],
                append_dat("G19") + ["TROCADO"],
                append_dat("G20") + ["INSPECIONADO"],
                append_dat("G21") + ["NÃO TROCADO"],
                append_dat("G22") + ["PASSADO DO TEMPO"],
                append_dat("G23") + [""],
                append_dat("G24"),
                append_dat("G25"),
                append_dat("G26"),
                append_dat("G27"),
                append_dat("G28"),
                append_dat("PR1"),
                append_dat("PR2"),
                append_dat("PR3"),
                append_dat("PR4")
            ]
        }
    }
    
    # Return Data Json
    return json.dumps(data)

# Parse
data = parse_data()

# Write to File
f = open("data.json", "w")
f.write(data)
f.close()