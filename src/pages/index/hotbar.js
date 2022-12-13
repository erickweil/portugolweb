import { elementIsAllScrolled, getScreenDimensions } from "../../extras/extras.js";

export default class Hotbar {
    constructor(div_hotbar,div_saida,errosSaida,isMobile,resizeEditorCallback) {
        this.isMobile = isMobile;
        this.hotbar = div_hotbar;
        this.div_saida = div_saida;
        this.errosSaida = errosSaida;
        this.resizeEditorCallback = resizeEditorCallback;
        this.hotbar_currentY;
        this.hotbar_initialY;
        this.hotbar_clickY;
        // se mexer nesses numeros tudo para de funcionar deixa assim.
        this.hotbar_initialHeight = 200;
        
        this.hotbar_minyOffset = 40;
        this.hotbar_collapsedyOffset = 80;
        this.hotbar_middleyOffset = 120;
        this.hotbar_extendedyOffset = 295;
        //var hotbar_maxyOffset = 300;
        this.hotbar_yOffset = this.hotbar_collapsedyOffset;
        this.hotbar_active = false;
        this.hotbar_textarea = false;
        this.hotbar_isDragging = false;

        this.hotbar.addEventListener("touchstart", (e)=>{this.hotbar_dragStart(e);}, false);
        this.hotbar.addEventListener("touchend", (e)=>{this.hotbar_dragEnd(e);}, false);
        this.hotbar.addEventListener("touchmove", (e)=>{this.hotbar_drag(e);}, false);
        
        this.hotbar.addEventListener("mousedown",(e)=>{this.hotbar_dragStart(e);}, false);
        window.addEventListener("mouseup", (e)=>{this.hotbar_dragEnd(e);}, false);
        //hotbar.addEventListener("mouseleave",hotbar_dragEnd, false);
        window.addEventListener("mousemove",(e)=>{this.hotbar_drag(e);}, false);
        
        window.addEventListener("resize", (e)=>{this.resizeEditorToFitHotbar(e);});
    }

    collapseUntil(offValue) {
        if(offValue == "MIDDLE")
        {
            if(this.hotbar_yOffset > this.hotbar_middleyOffset)
            {
                this.setHotbarPosition(this.hotbar_middleyOffset,true);
            }
        }
        if(offValue == "EXTENDED")
        {
            if(this.hotbar_yOffset > this.hotbar_extendedyOffset)
            {
                this.setHotbarPosition(this.hotbar_extendedyOffset,true);
            }
        }
    }

    extendUntil(offValue) {
        if(offValue == "EXTENDED")
        {
            if(this.hotbar_yOffset < this.hotbar_extendedyOffset)
            this.setHotbarPosition(this.hotbar_extendedyOffset,true);
        }
    }

    toggleHotbar(show)
	{
		if(!show)
		{
			this.ocultarHotbar();
			if(this.isMobile)
			{
				if(this.hotbar_yOffset > this.hotbar_middleyOffset)
				{
					this.setHotbarPosition(this.hotbar_middleyOffset,true);
				}
			}
		}
		else
		{
			this.mostrarHotbar();
		}
	}

    mostrarHotbar()
	{
		// se mexer nesses numeros tudo para de funcionar deixa assim.
		this.hotbar_initialHeight = 200;
		
		
		this.hotbar_minyOffset = 40;
		this.hotbar_collapsedyOffset = 80;
		this.hotbar_middleyOffset = 120;
		this.hotbar_extendedyOffset = 295;
		this.hotbar_yOffset = this.hotbar_collapsedyOffset;
		
		document.getElementById("hotbar_commands").style.display = "block";
		
		document.getElementById("hotbar_keys").style.display = "block";
		
		//document.getElementById("btn-mostrar-hotbar").value = "Ocultar";
		document.getElementById("check-mostrar-hotbar").checked = true;
		
		this.setHotbarPosition(this.hotbar_middleyOffset);
	}
	
	ocultarHotbar()
	{
		// se mexer nesses numeros tudo para de funcionar deixa assim.
		this.hotbar_initialHeight = 200 - 80;
		
		this.hotbar_minyOffset = 40;
		this.hotbar_collapsedyOffset = 80 - 80;
		this.hotbar_middleyOffset = 120 - 80;
		this.hotbar_extendedyOffset = 295 - 80;
		//hotbar_maxyOffset = hotbar_maxyOffset + 600;
		this.hotbar_yOffset = 0;
		//hotbar.style.display = "none";
		
		document.getElementById("hotbar_commands").style.display = "none";
		
		document.getElementById("hotbar_keys").style.display = "none";
		
		//document.getElementById("btn-mostrar-hotbar").value = "Mostrar";
		document.getElementById("check-mostrar-hotbar").checked = false;
		
		this.setHotbarPosition(this.hotbar_extendedyOffset);
	}

    // HOTBAR	
	hotbar_dragStart(e) {
		let yValue = 0;
		if (e.type === "touchstart") {
			yValue = -e.touches[0].clientY;
		} else {
			yValue = -e.clientY;
		}
		
		this.hotbar_clickY = yValue;
		this.hotbar_initialY = yValue - this.hotbar_yOffset;

		//console.log("click:"+hotbar_clickY);
		if(e.target === this.errosSaida)
		{
			// nada. deixa quieto
		}
		else if(e.target === this.div_saida)
		{
			this.hotbar_textarea = true;
		}
		else
        if (e.target === this.hotbar || e.type !== "touchstart") {
			this.hotbar_active = true;
		}
    }

    hotbar_dragEnd(e) {
		if(e.type !== "touchend")
		{
			if(!this.hotbar_active) return; // só passou o mouse
			
			this.hotbar.style.cursor = "grab";
		}
		//initialX = currentX;
		this.hotbar_initialY = this.hotbar_currentY;

		
		
		/*if(hotbar_yOffset > (hotbar_extendedyOffset + 30))
		{
			setHotbarPosition(hotbar_maxyOffset,true);
		}
		else */
		if(this.hotbar_yOffset > (this.hotbar_middleyOffset + 30) && this.hotbar_yOffset < this.hotbar_extendedyOffset)
		{
			this.setHotbarPosition(this.hotbar_extendedyOffset,true);
		}
		else if(Math.abs(this.hotbar_yOffset - this.hotbar_middleyOffset) < 30)
		{
			this.setHotbarPosition(this.hotbar_middleyOffset,true);
		}
		else if(Math.abs(this.hotbar_yOffset - this.hotbar_collapsedyOffset) < 30)
		{
			this.setHotbarPosition(this.hotbar_collapsedyOffset,true);
		}
		else if(Math.abs(this.hotbar_yOffset - this.hotbar_minyOffset) < 30)
		{
			this.setHotbarPosition(this.hotbar_minyOffset,true);
		}
		else
		{
			this.resizeEditorToFitHotbar();
		}


		this.hotbar_active = false;
		this.hotbar_textarea = false;
		this.hotbar_isDragging = false;
    }

    hotbar_drag(e) {
		let yValue = 0;
		if (e.type === "touchmove") {
			yValue = -e.touches[0].clientY;
		} else {
			if(!this.hotbar_active) return; // só passou o mouse
			yValue = -e.clientY;
			
			this.hotbar.style.cursor = "grabbing";
		}
		
		let hotbar_lastY = this.hotbar_currentY;
		this.hotbar_currentY = yValue - this.hotbar_initialY;
		let yOff = Math.abs(this.hotbar_clickY - yValue);
		//console.log("drag:"+hotbar_initialY);
		
		
	
		if (!this.hotbar_active) {
		
			if(this.hotbar_textarea && !elementIsAllScrolled(this.div_saida))
			{
				this.hotbar_clickY = yValue;
				this.hotbar_initialY = yValue - this.hotbar_yOffset;
				return;
			}
		
			if(yOff < 20)
			{
				return;
			}
			else
			{
				this.hotbar_active = true;
			}
		}
		else
		{
			if(e.cancelable)
			{
				e.preventDefault();
			}
		}

		//xOffset = currentX;
		

		//setTranslate(hotbar_currentY, hotbar);
		this.setHotbarPosition(this.hotbar_currentY,false,true);
		
		if(!this.hotbar_isDragging)
		this.resizeEditorMax();
		
		this.hotbar_isDragging = true;
    }

    setHotbarPosition(yPos,animate,fastUpdates) {
		if(animate)
		{
			this.hotbar.classList.add('animate');
		}
		else
		{
			this.hotbar.classList.remove('animate');
		}
		
		
		//el.style.transform = "translate3d(0px,	  " + yPos + "px, 0)";
		let screenDimension = getScreenDimensions();
		this.hotbar_yOffset = Math.max(this.hotbar_minyOffset,yPos);
		this.hotbar_yOffset = Math.min(this.hotbar_yOffset,screenDimension.height-5);
		//hotbar_yOffset = Math.min(hotbar_maxyOffset,yPos);
		this.hotbar.style.bottom = (this.hotbar_yOffset - this.hotbar_initialHeight)+"px";
		
		if(!fastUpdates)
		this.resizeEditorToFitHotbar(false);
    }

    resizeEditorToFitHotbar(e)
	{
		let h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		
		//if(!isMobile)
		//document.getElementById("myEditor").style.height = (h-hotbar_yOffset+15)+"px";
		//else
		this.resizeEditorCallback(h-this.hotbar_yOffset);
		
		
		let isHotbarVisible = document.getElementById("hotbar_commands").style.display != "none";
		
		if(!isHotbarVisible)
		this.div_saida.style.height = (this.hotbar_yOffset-50)+"px";
		else
		this.div_saida.style.height = (this.hotbar_yOffset-130)+"px";
		
	}
	
	resizeEditorMax()
	{
		let screenDimension = getScreenDimensions();
		
		this.resizeEditorCallback(screenDimension.height);
		
		this.div_saida.style.height = (screenDimension.height)+"px";
	}
}