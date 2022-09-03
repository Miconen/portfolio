<script>
  import LogoMenu from './LogoMenu.svelte'
</script>

<div class="nav__content--desktop">
  <LogoMenu/>
  <ul class="nav__links">
    <li><a href="#">Projects</a></li>
    <p>x</p>
    <li><a>Skills</a></li>
    <p>x</p>
    <li><a>About Me</a></li>
  </ul>
  <button class="nav__contact">Contact</button>
</div>

<style>
  @media only screen and (max-width: 1024px) {
    .nav__content--desktop {
      display: none!important;
    } 
  } 
.nav__content--desktop {
  display: inline-flex; 
  justify-content: space-between;
  width: 100%;
  height: 60px;
}

.nav__links {
    margin: 0;
    padding: 0;
    list-style: none;
    display: inline-flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }
  
  .nav__links > * {
    text-align: center;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 2.5px;
  }

  .nav__links a {
    display: block;
    height: 100%;
    color: #2D3436;
  } 

  .nav__links li {
    width: 100%;
    position: relative;
  }

  .nav__links a:after {
    content: "";
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
  }

  .nav__links a:hover {
    background-color: rgba(166,177,225,0.25);
  }

  .nav__links p {
    color: #A6B1E1;
  }

  .nav__contact {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
