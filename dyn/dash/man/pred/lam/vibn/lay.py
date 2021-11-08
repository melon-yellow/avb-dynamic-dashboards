
import json
from vib import vib

# Parse Layout
def parse_layout():

    items = vib()

    height = lambda x: (len(x)+1)*5

    h = dict(
        fm=height(items['fm']),
        rb=height(items['rb'])
    )

    ts = (" background-color: #f8f9fa;" +
        " border: 2px solid #343a40;" +
        " font-weight: bold;" +
        " color: #343a40;")

    st = [[dict(css=ts),dict(css=ts),
        dict(css=ts), dict(css=ts),dict(css=ts)]]

    layout = {
        "layout": [
            {
                "type": "layout",
                "sidenav": {
                "display": "True"
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
                        "grid": 6,
                        "content": [
                        {
                            "type": "card",
                            "name": "Vibração Bloco - Fio Máquina",
                            "header": {
                            "color": "#f8f9fa",
                            "font": {
                                "color": "#343a40",
                                "size": 1.2
                            }
                            },
                            "body": {
                            "height": h['fm'],
                            "color": "#f8f9fa"
                            },
                            "elements": [
                            {
                                "type": "datatable",
                                "addons": [],
                                "data": [
                                {
                                    "dataset": "vib_bit_ntm_fm_datatable",
                                    "style": st
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    },
                    {
                        "type": "col",
                        "grid": 6,
                        "content": [
                        {
                            "type": "card",
                            "name": "Vibração Bloco - Vergalhão",
                            "header": {
                            "color": "#f8f9fa",
                            "font": {
                                "color": "#343a40",
                                "size": 1.2
                            }
                            },
                            "body": {
                            "height": h['rb'],
                            "color": "#f8f9fa"
                            },
                            "elements": [
                            {
                                "type": "datatable",
                                "addons": [],
                                "data": [
                                {
                                    "dataset": "vib_bit_ntm_rb_datatable",
                                    "style": st
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    }
                    ]
                },
                {
                    "type": "row",
                    "content": []
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