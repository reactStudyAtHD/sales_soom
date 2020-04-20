import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EventIcon from '@material-ui/icons/Event';
import SalesManagement from './SalesManagement';
import MonthlySales from './MonthlySales';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		background: '#DCDCDC',
		color: '#696969',
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}));

export default function MiniDrawer() {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const [renderedComponent, setRenderedComponent] = useState(<SalesManagement/>);
	
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	
	const handleDrawerClose = () => {
		setOpen(false);
	};
	
	const changeBody = (clickedMenu) => {
		if (clickedMenu === '매출관리') setRenderedComponent(<SalesManagement/>);
		else setRenderedComponent(<MonthlySales/>);
	};
	
	return (
		<div className={classes.root}>
			<CssBaseline/>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon/>
					</IconButton>
					<Typography variant="h6" noWrap>
						매출 관리 sales app
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
					</IconButton>
				</div>
				<Divider/>
				<List>
					{[{ title: '매출관리', icon: <AttachMoneyIcon/> }, { title: '월간매출', icon: <EventIcon/> }].map(menu => (
						<ListItem button key={menu.title} onClick={() => changeBody(menu.title)}>
							<ListItemIcon>{menu.icon}</ListItemIcon>
							<ListItemText primary={menu.title}/>
						</ListItem>
					))}
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.toolbar}/>
				{renderedComponent}
			</main>
		</div>
	);
}
