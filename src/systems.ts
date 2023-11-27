import {
	engine,
	Transform,
	inputSystem,
	PointerEvents,
	InputAction,
	PointerEventType,
	Material,
	Entity,
	AudioSource,
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { Cube, Spinner, Tile, TileColor } from './components'
import { getRandomHexColor } from './utils'
import { MY_COLOR } from './factory'


/**
 * All cubes rotating behavior
 */
export function colorTiles(dt: number) {

	const PlayerPos = Transform.get(engine.PlayerEntity).position

	const tileEntities = engine.getEntitiesWith(Tile, Transform)
	for (const [entity, _tile, _transform] of tileEntities) {
		const pos = Transform.get(entity).position

		if (Math.abs(pos.x - PlayerPos.x) < 1.4 && Math.abs(pos.z - PlayerPos.z) < 1.4) {
			if (_tile.color == MY_COLOR) continue
			changeTileColor(entity, MY_COLOR)
		}
	}
}



export function changeTileColor(tile: Entity, color: TileColor) {

	if (Tile.get(tile).color == color) return

	switch (color) {
		case TileColor.BLUE:
			Material.setPbrMaterial(tile, { albedoColor: Color4.Blue() })
			break;
		case TileColor.GREEN:
			Material.setPbrMaterial(tile, { albedoColor: Color4.Green() })
			break;
		case TileColor.RED:
			Material.setPbrMaterial(tile, { albedoColor: Color4.Red() })
			break;
		case TileColor.YELLOW:
			Material.setPbrMaterial(tile, { albedoColor: Color4.Yellow() })
			break;
		case TileColor.NONE:
			Material.setPbrMaterial(tile, { albedoColor: undefined })
			break;
	}

	AudioSource.getMutable(tile).playing = true

	Tile.getMutable(tile).color = color
	console.log("PAINTED TILE  ", tile, " TO COLOR ", color)
}


export function resetAllTiles() {

	const tileEntities = engine.getEntitiesWith(Tile, Transform)
	for (const [entity, _tile, _transform] of tileEntities) {

		changeTileColor(entity, TileColor.NONE)

	}
}