from .db import database
from .filtering_functions import apply_filters
import json

def db_dict(rows, columns, result):
    for row in rows:
            row_dict = {}
            for i in range(len(columns)):
                row_dict[columns[i]] = row[i]
            result.append({
                "title": row_dict["work_title"],
                "period": row_dict["composer_period"],
                "author": row_dict["composer"],
                "difficulty": {
                    "x1": row_dict["latent_map_x1"],
                    "x2": row_dict["latent_map_x2"]
                },
                "id": row_dict["musicsheetid"],
                "key": row_dict["_key"]
            })
    return result

def get_pieces(size, page, key=None, period=None, min_difficulty=None, max_difficulty=None):

    result = []
    with database() as cursor:
       # Apply filter if a filter_value is provided
        if key is not None or period is not None:
            cursor, total_pages = apply_filters(page, cursor, size, key, period, min_difficulty, max_difficulty)
            #cursor, total_pages=filtering_period(page, cursor, size, filter_value)
        else:
            # No filter applied, retrieve all pieces
            cursor.execute('SELECT COUNT(musicsheetid) FROM musicsheet')
            total_pages = cursor.fetchone()[0]
            # Ensure the page number is within the valid range
            if page < 1:
                page = 1
            elif page > total_pages:
                page = total_pages

            offset = (page - 1) * size

            # Select from the database without the filter and with pagination
            cursor.execute('SELECT * FROM musicsheet LIMIT %(limit)s OFFSET %(offset)s', {'limit':size, 'offset': offset})

        # Get the names of the columns
        columns = [desc[0] for desc in cursor.description]

        # Get the rows for the current page
        rows = cursor.fetchall()
        pieces = db_dict(rows, columns, result)

    return pieces, total_pages
        
   

def get_pieces_id(id):
    result = []
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        piece=db_dict(rows, columns, result)
    return piece[0]
