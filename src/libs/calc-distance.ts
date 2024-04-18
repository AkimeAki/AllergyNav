const degToRad = (deg: number): number => {
	return (deg * Math.PI) / 180;
};

// 何この計算意味分からん 測地線航海算法っていうらしい
export const calcDistance = (x1: number, y1: number, x2: number, y2: number): number => {
	const rx = 6378.137; // 回転楕円体の長半径（赤道半径）[km]
	const ry = 6356.752; // 回転楕円体の短半径（極半径) [km]

	const p1 = Math.atan((ry / rx) * Math.tan(degToRad(y1))); // 地点Aの化成緯度
	const p2 = Math.atan((ry / rx) * Math.tan(degToRad(y2))); // 地点Bの化成緯度
	const x = Math.acos(
		Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(degToRad(x1) - degToRad(x2))
	); // 球面上の距離
	const f = (rx - ry) / rx; // 扁平率
	const dr =
		(f / 8) *
		(((Math.sin(x) - x) * Math.pow(Math.sin(p1) + Math.sin(p2), 2)) / Math.pow(Math.cos(x / 2), 2) -
			((Math.sin(x) + x) * Math.pow(Math.sin(p1) - Math.sin(p2), 2)) / Math.pow(Math.sin(x / 2), 2)); // 距離補正量

	return rx * (x + dr); // 距離[km]
};
