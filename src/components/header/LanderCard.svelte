<script></script>

<div class="landercard">
  <div class="line__bg--dark"/>
  <div class="line__bg--light"/>
  <div class="line__fg--light"/>
  <div class="ellipse__fg--light"/>
  <div class="ellipse__fg--dark"/>
  <div class="text">
    <div class="mico">Mico</div>
    <div class="rintala">Rintala.</div>
  </div>
</div>

<style>

/* Landercard */
.landercard {
	position: absolute;
	height: 305px;
	width: 600px;
	background: #FFFFFF;
	border-radius: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Line bg dark */
.line__bg--dark {
	position: absolute;
	width: 74.27px;
	height: 433.24px;
	left: 287px;
	top: 4px;
	background: #424874;
	transform: matrix(0.71, -0.71, -0.71, -0.71, 0, 0);
  z-index: -1;
}

/* Line bg light */
.line__bg--light {
	position: absolute;
	width: 75px;
	height: 428.98px;
	left: 380px;
	top: -140px;
	background: #A6B1E1;
	transform: matrix(0.71, -0.71, -0.71, -0.71, 0, 0);
  z-index: -1;
}

.text {
  position: absolute;
	left: 10%;
	font-weight: 800;
	font-size: 96px;
	line-height: 104px;
	letter-spacing: -3px;
	color: #2D3436;
}

.mico {
  top: 10%;
}

.rintala {
  top: 40%;
}

/* Ellipse fg light*/
.ellipse__fg--light {
	position: absolute;
	width: 160px;
	height: 160px;
	left: -100px;
	top: 220px;
  border-radius: 100%;
	background: #DCD6F7;
}

/* Ellipse fg dark */
.ellipse__fg--dark {
	position: absolute;
	width: 90px;
	height: 90px;
	left: 450px;
	top: -40px;
  border-radius: 100%;
	background: #424874;
}

/* Line fg light */
.line__fg--light {
	position: absolute;
	width: 75px;
	height: 204.45px;
	left: 461px;
  top: 201px;
	background: #A6B1E1;
	transform: matrix(-0.71, -0.71, -0.71, 0.71, 0, 0);
  border-radius: 0 0 0 0;
}
</style>
