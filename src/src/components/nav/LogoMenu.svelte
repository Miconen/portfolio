<script></script>

<span class="nav__logo"><span class="astro-gradient logo__flare">&lt;</span>Mico<span class="logo__flare">/&gt;</span></span>

<style>
  .nav__logo {
    font-weight: bolder; 
    font-size: 2em;
    margin-top: auto;
    margin-bottom: auto;
    height: auto;
    line-height: 0;
  }
  .logo__flare {
    /* color: #A6B1E1; */
		background-image: linear-gradient(0deg, #6d82de, #A6B1E1); 
		-webkit-background-clip: text;
    background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 100% 200%;
		background-position-y: 100%;
		border-radius: 0.4rem;
		animation: pulse 4s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			background-position-y: 0%;
		}
		50% {
			background-position-y: 80%;
		}
	}
</style>
