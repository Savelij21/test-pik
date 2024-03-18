import sqlalchemy as sa
import geoalchemy2 as gsa
import json

from shapely.geometry import shape
from pathlib import Path

from sqlalchemy import func

import config

# инициализация БД
eng = sa.create_engine(config.DB_URI)
metadata = sa.MetaData(bind=eng, schema='app')
table = sa.Table(
    "points",
    metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("name", sa.String(1)),
    sa.Column("geometry", gsa.Geometry(geometry_type='POLYGON', srid=4326)),
)
with eng.begin() as conn:
    conn.execute('create schema if not exists app')
metadata.create_all()

# инициализация исходных данных
input_data = [
    {**i['properties'], 'geometry': shape(i['geometry']).geoms[0].wkt} 
    for i in json.loads(Path('input_data.geojson').read_bytes())['features']
]
with eng.begin() as conn:
    if conn.execute(sa.select(sa.func.count()).select_from(table)).scalar() == 0:
        conn.execute(
            sa.insert(table),
            input_data
        )


def to_geojson(records):
    features = []
    for r in records:
        r = dict(r)
        geom = r.pop('geometry')
        features.append({'type': 'Feature', 'properties': r, 'geometry': json.loads(geom)})
    return {'type': 'FeatureCollection', 'features': features}


def get_all():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([table.c.id, table.c.name, table.c.geometry.ST_AsGeoJSON().label('geometry')]))
        return to_geojson(cur)


# DEVELOPMENT
def get_a_b():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([table.c.id, table.c.name, table.c.geometry.ST_AsGeoJSON().label('geometry')]))
        return to_geojson(cur)


def get_a():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([table.c.id, table.c.name, table.c.geometry.ST_AsGeoJSON().label('geometry')]).where(table.c.id == 1))
        return to_geojson(cur)


def get_b():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([table.c.id, table.c.name, table.c.geometry.ST_AsGeoJSON().label('geometry')]).where(table.c.id == 2))
        return to_geojson(cur)


def get_intersection_a_b():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([func.ST_AsGeoJSON(func.ST_Intersection(
            sa.select(table.c.geometry).where(table.c.id == 1),
            sa.select(table.c.geometry).where(table.c.id == 2)
        )).label('geometry')]))

        return to_geojson(cur)
