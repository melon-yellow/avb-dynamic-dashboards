
import json
from datetime import datetime, date, timedelta
from vib import vib

# Parse Data
def parse_data():

    items = vib()
    
    def create_row(info):
        rows = [["Data", "Vibração", "Rotação", "Velocidade", "Bitola"]]
        for a in range(len(items[info])):
            rows.append([items[info][a][0],
                "{} mm/s".format(round(items[info][a][1], 2)),
                "{} RPM".format(round(items[info][a][2], 2)),
                "{} m/s".format(round(items[info][a][5], 1)),
                "{} mm".format(round(items[info][a][3], 1))
            ])
        return rows
            
    data = dict(
        vib_bit_ntm_fm_datatable = {
            "name": "VIB_BIT_NTM",
            "type": "datatable",
            "data": create_row("fm")
        },
        vib_bit_ntm_rb_datatable = {
            "name": "VIB_BIT_NTM DATATABLE",
            "type": "datatable",
            "data": create_row("rb")
        }
    )
    return data

data = parse_data()

f = open("data.json", "w")
f.write(json.dumps(data))
f.close()