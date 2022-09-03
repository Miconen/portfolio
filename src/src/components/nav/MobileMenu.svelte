<script>
  import DropdownButton from './DropdownButton.svelte';
  import LogoMenu from './LogoMenu.svelte'
  let active = false;
  const toggleMobileNav = () => {
    active = !active;
    console.log(active);
  }
</script>

<div class="nav__content--mobile">
  <div class="inner__content">
    <LogoMenu/>
    <DropdownButton on:click={toggleMobileNav}/>
  </div>
  <ul class="nav__links" class:active={active}>
    <li>Projects</li>
    <li>Skills</li>
    <li>About Me</li>
    <li>Contact</li>
  </ul>
</div>

<style>
  /* min width = breakpoint + 1px */ 
  @media only screen and (min-width: 1025px) {
    .nav__content--mobile {
      display: none!important;
    }
  } 

  .nav__content--mobile {
    height: 60px;
  }
  
  .inner__content {
    display: flex;
    justify-content: space-between;
    height: 60px;
  }

  .nav__links {
    display: none;
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: center;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 2.5px;
  }

  .active {
    display: block;
  }

  .nav__links li {
    border-top: solid 1px;
    border-bottom: solid 1px;
    border-image-slice: 1;
    border-image-source: linear-gradient(90deg, rgba(0,0,0,0) 10%, rgba(45,52,54,1) 33%, rgba(45,52,54,1) 66%, rgba(0,0,0,0) 90%); 
    /* Mobile nav link menu background gradient like borders */
    /* background: linear-gradient(90deg, rgba(0,0,0,0) 10%, rgba(255,255,255,1) 33%, rgba(255,255,255,1) 66%, rgba(0,0,0,0) 90%); */ 
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

</style>
