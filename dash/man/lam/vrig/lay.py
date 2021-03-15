
import json
from vrig import vring

# Parse Layout
def parse_layout():

    vrings = vring()

    lays = dict(
        G19=['','','','',''], G20=['','','','',''],
        G21=['','','','',''], G22=['','','','',''],
        G23=['','','','',''], G24=['','','','',''],
        G25=['','','','',''], G26=['','','','',''],
        G27=['','','','',''], G28=['','','','',''],
        PR1=['','','','',''], PR2=['','','','',''],
        PR3=['','','','',''], PR4=['','','','','']
    )

    # Função que extrai os "Valores Lidos" da query
    def Extract(lst): 
        for item in lst:
            return item[2]

    # Layout Constructor
    def layset(key):
        for i in range(-6, -1):     
            if Extract(vrings[key][i+1:]) == 100:
                lays[key][i+6] = "background-color: rgb(64,255,64)"
            elif Extract(vrings[key][i+1:]) == 50:
                lays[key][i+6] = "background-color: rgb(72,128,255)"
            elif Extract(vrings[key][i+1:]) == 0:
                lays[key][i+6] = "background-color: rgb(255,255,32)"

    # Set Layouts
    for key in lays: layset(key)

    ts = (" background-color: #f8f9fa;" +
        " border: 2px solid #343a40;" +
        " font-weight: bold;" +
        " color: #343a40;")

    # Append Layout to Json
    def append_lay(key):
        return [dict(css=ts),
            dict(css="{}".format(lays[key][0])),
            dict(css="{}".format(lays[key][1])),
            dict(css="{}".format(lays[key][2])),
            dict(css="{}".format(lays[key][3])),
            dict(css="{}".format(lays[key][4])),
            dict()
        ]

    # Set Style
    style = [
        [dict(css=ts, width=180), dict(css=ts), dict(css=ts), dict(css=ts), dict(css=ts),
            dict(css=ts), dict(css=ts), dict(css="background-color: rgb(216,216,216)" + ts, width=180)],
        append_lay("G19") + [dict(css="background-color: rgb(64,255,64)")],
        append_lay("G20") + [dict(css="background-color: rgb(72,128,255)")],
        append_lay("G21") + [dict(css="background-color: rgb(255,255,32)")],
        append_lay("G22") + [dict(css="background-color: rgb(225,64,64)")],
        append_lay("G23") + [dict(css="background-color: rgb(216,216,216)", rowspan=10)],
        append_lay("G24"),
        append_lay("G25"),
        append_lay("G26"),
        append_lay("G27"),
        append_lay("G28"),
        append_lay("PR1"),
        append_lay("PR2"),
        append_lay("PR3"),
        append_lay("PR4")
    ]

    layout = {
        "layout": [
            {
                "type": "layout",
                "sidenav": {
                    "display": "true"
                },
                "topnav": [],
                "body": {
                    "color": "#f8f9fa",
                    "font": {
                    "color": "#343a40",
                    "size": 1.2
                    }
            },
            "content": [
                {
                    "type": "row",
                    "content": [
                        {
                        "type": "col",
                        "grid": 12,
                        "content": [
                            {
                            "type": "card",
                            "name": "Troca de Vedações V.Rings",
                            "header": {
                                "color": "#f8f9fa",
                                "font": {
                                "color": "#343a40",
                                "size": 1.2
                                }
                            },
                            "body": {
                                "height": 80,
                                "color": "#f8f9fa"
                            },
                            "elements": [
                                {
                                "type": "datatable",
                                "addons": [],
                                "data": [
                                    {
                                    "dataset": "SUBSTVRING_datatable",
                                    "style": style
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                        }
                    ]
                    }
                ]
            }
        ]
    }

    # Return Layout Json
    return json.dumps(layout)

# Parse
layout = parse_layout()

# Write to File
f = open("layout.json", "w")
f.write(layout)
f.close()